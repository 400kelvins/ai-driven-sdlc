import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseDocument } from 'yaml'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const ci = readFileSync(`${ROOT}.github/workflows/ci.yml`, 'utf8')
const review = readFileSync(`${ROOT}.github/workflows/claude-review.yml`, 'utf8')
const visuals = readFileSync(`${ROOT}.github/workflows/pr-visuals.yml`, 'utf8')
const ALL = [ci, review, visuals]

// Job ids sit at two-space indent under `jobs:`
const jobs = (yml) => [...yml.split(/^jobs:\n/m)[1].matchAll(/^ {2}([\w-]+):\s*$/gm)].map((m) => m[1])
const uses = (yml) => [...yml.matchAll(/uses:\s*(\S+)/g)].map((m) => m[1])

test('all workflows are valid YAML (GitHub silently runs no jobs otherwise)', () => {
  for (const yml of ALL) assert.deepEqual(parseDocument(yml).errors.map((e) => e.message), [])
})

test('CI has exactly the two required checks branch protection names', () => {
  assert.deepEqual(jobs(ci), ['verify', 'human-gate'])
})

test('CI runs on pull requests and pushes to main', () => {
  assert.match(ci, /pull_request:\s*\n\s+branches:\s*\[main\]/)
  assert.match(ci, /push:\s*\n\s+branches:\s*\[main\]/)
})

test('CI runs the same verify and gate check as npm run ship', () => {
  assert.match(ci, /run: npm run verify/)
  assert.match(ci, /run: npm run gate:check/)
})

test('the human gate fingerprints the PR head commit, not the merge ref', () => {
  const gate = ci.split(/^ {2}human-gate:/m)[1]
  assert.match(gate, /ref: \$\{\{ github\.event\.pull_request\.head\.sha \|\| github\.sha \}\}/)
})

test('workflows default to read-only permissions', () => {
  for (const yml of ALL) assert.match(yml, /^permissions:\n {2}contents: read/m)
})

test('every action is pinned to a full commit SHA, with its version in a comment', () => {
  for (const yml of ALL) {
    for (const m of yml.matchAll(/uses:\s*(\S+)(.*)/g)) {
      assert.match(m[1], /@[0-9a-f]{40}$/, m[1])
      assert.match(m[2], /# v\d+\.\d+\.\d+$/, m[1])
    }
  }
})

test('checkouts never leave the GitHub token in .git/config', () => {
  for (const yml of ALL) {
    const checkouts = yml.split('uses: actions/checkout@').length - 1
    assert.equal((yml.match(/persist-credentials: false/g) ?? []).length, checkouts)
  }
})

test('pushes to main never cancel each other', () => {
  assert.match(ci, /cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \}\}/)
})

test('branch protection requires both checks, up to date, for admins too', () => {
  const p = JSON.parse(readFileSync(`${ROOT}.github/branch-protection.json`, 'utf8'))
  // Pinned to the GitHub Actions app (15368), so no other app or token can post a green check
  assert.deepEqual(p.required_status_checks, { strict: true, checks: jobs(ci).map((context) => ({ context, app_id: 15368 })) })
  assert.equal(p.enforce_admins, true)
  assert.equal(p.allow_force_pushes, false)
  assert.equal(p.allow_deletions, false)
})

test('AI review uses the pinned action and the token only from secrets', () => {
  assert.match(review, /uses: anthropics\/claude-code-action@[0-9a-f]{40} # v1\.0\.237/)
  assert.match(review, /anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/)
  assert.doesNotMatch(review, /sk-ant-[A-Za-z0-9_-]{10,}/)
})

test('AI review skips forks and a missing secret visibly, and is not a required check', () => {
  assert.match(review, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/)
  assert.match(review, /steps\.secret\.outputs\.present == 'true'/)
  assert.match(review, /::warning::AI review skipped/)
  assert.match(review, /_Skipped: %s\._/)
  assert.ok(!jobs(review).some((j) => ['verify', 'human-gate'].includes(j)))
})

test('the model runs in a read-only job; only a separate model-free job writes to the PR', () => {
  const doc = parseDocument(review).toJS()
  assert.deepEqual(doc.jobs.review.permissions, { contents: 'read', 'pull-requests': 'read' })
  assert.deepEqual(doc.jobs.post.permissions, { 'pull-requests': 'write' })
  assert.equal(doc.jobs.post.needs, 'review')
  assert.ok(!doc.jobs.post.steps.some((s) => String(s.uses ?? '').includes('claude-code-action')))
  assert.ok(!doc.jobs.post.steps.some((s) => String(s.uses ?? '').includes('actions/checkout')))
})

test('the model cannot publish: no comment or API tool; a shell step posts after a token scan', () => {
  const allowed = review.match(/--allowedTools "([^"]+)"/)[1]
  assert.doesNotMatch(allowed, /gh pr comment|gh api|Bash\(\*|WebFetch/)
  assert.match(review, /--disallowedTools "[^"]*Bash\(gh pr comment:\*\)/)
  assert.match(review, /grep -Eq 'sk-ant-/)
  // The guard matches real token shapes, not a review that quotes the pattern itself
  const guard = new RegExp(review.match(/grep -Eq '([^']+)' "\$body"/)[1])
  assert.ok(guard.test('sk-ant-api03-' + 'x'.repeat(30)))
  assert.ok(guard.test('github_pat_' + 'y'.repeat(30)))
  assert.ok(!guard.test("grep -Eq 'sk-ant-|gh[pousr]_'"))
  assert.match(review, /printf '## AI code review/)
})

test('the AI review opens with a Mermaid diagram of the change', () => {
  assert.match(review, /```mermaid/)
  assert.match(review, /diagram[^\n]*before the findings|before the findings[^\n]*diagram/i)
})

test('slide screenshots: PR code runs read-only; only a job without PR code writes', () => {
  const doc = parseDocument(visuals).toJS()
  assert.deepEqual(Object.keys(doc.jobs), ['shots', 'publish'])
  assert.deepEqual(doc.jobs.shots.permissions, { contents: 'read' })
  assert.deepEqual(doc.jobs.publish.permissions, { contents: 'write', 'pull-requests': 'write' })
  assert.equal(doc.jobs.publish.needs, 'shots')
  const publish = doc.jobs.publish.steps
  assert.ok(!publish.some((s) => String(s.uses ?? '').includes('actions/checkout')))
  assert.ok(!publish.some((s) => /npm |node |npx /.test(s.run ?? '')), 'publish runs no PR code')
  // Shots checks out the PR head and base, never with a stored token
  const refs = doc.jobs.shots.steps.filter((s) => String(s.uses ?? '').includes('actions/checkout')).map((s) => s.with.ref)
  assert.deepEqual(refs, ['${{ github.event.pull_request.head.sha }}', '${{ github.event.pull_request.base.sha }}'])
})

test('slide screenshots run only on pull_request, never pull_request_target', () => {
  const doc = parseDocument(visuals).toJS()
  assert.deepEqual(Object.keys(doc.on), ['pull_request'])
  assert.doesNotMatch(visuals, /pull_request_target/)
})

test('the publish job treats the artifact as untrusted', () => {
  assert.match(visuals, /\^\[0-9\]\{3\}-\(before\|after\)\\\.png\$/)
  assert.match(visuals, /89504e470d0a1a0a/)
  assert.match(visuals, /IN\("changed", "new", "removed"\)/)
  assert.match(visuals, /keys == \["kind", "slide"\]/)
})

test('images go to pr-assets, folder per PR and commit, never main', () => {
  assert.match(visuals, /pr-assets/)
  assert.match(visuals, /assets\/pr-\$PR\/\$SHA/)
  assert.doesNotMatch(visuals, /push[^\n]*\bmain\b/)
})

test('slide screenshots skip forks visibly and are not a required check', () => {
  assert.match(visuals, /head\.repo\.full_name == github\.repository/)
  assert.match(visuals, /::warning::Slide screenshots skipped/)
  assert.ok(!jobs(visuals).some((j) => ['verify', 'human-gate'].includes(j)))
})

test('the slide comment has one marker and is updated in place', () => {
  assert.match(visuals, /## Slide changes/)
  assert.match(visuals, /No slide changed/)
  assert.match(visuals, /gh api -X PATCH/)
})
