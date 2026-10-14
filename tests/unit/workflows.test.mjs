import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const ci = readFileSync(`${ROOT}.github/workflows/ci.yml`, 'utf8')
const review = readFileSync(`${ROOT}.github/workflows/claude-review.yml`, 'utf8')

// Job ids sit at two-space indent under `jobs:`
const jobs = (yml) => [...yml.split(/^jobs:\n/m)[1].matchAll(/^ {2}([\w-]+):\s*$/gm)].map((m) => m[1])
const uses = (yml) => [...yml.matchAll(/uses:\s*(\S+)/g)].map((m) => m[1])

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
  for (const yml of [ci, review]) assert.match(yml, /^permissions:\n {2}contents: read/m)
})

test('every action is pinned to a full commit SHA, with its version in a comment', () => {
  for (const yml of [ci, review]) {
    for (const m of yml.matchAll(/uses:\s*(\S+)(.*)/g)) {
      assert.match(m[1], /@[0-9a-f]{40}$/, m[1])
      assert.match(m[2], /# v\d+\.\d+\.\d+$/, m[1])
    }
  }
})

test('checkouts never leave the GitHub token in .git/config', () => {
  for (const yml of [ci, review]) {
    const checkouts = yml.split('uses: actions/checkout@').length - 1
    assert.equal((yml.match(/persist-credentials: false/g) ?? []).length, checkouts)
  }
})

test('pushes to main never cancel each other', () => {
  assert.match(ci, /cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \}\}/)
})

test('branch protection requires both checks, up to date, for admins too', () => {
  const p = JSON.parse(readFileSync(`${ROOT}.github/branch-protection.json`, 'utf8'))
  assert.deepEqual(p.required_status_checks, { strict: true, contexts: jobs(ci) })
  assert.equal(p.enforce_admins, true)
  assert.equal(p.allow_force_pushes, false)
  assert.equal(p.allow_deletions, false)
})

test('AI review uses the pinned action and the token only from secrets', () => {
  assert.match(review, /uses: anthropics\/claude-code-action@[0-9a-f]{40} # v1\.0\.237/)
  assert.match(review, /claude_code_oauth_token: \$\{\{ secrets\.CLAUDE_CODE_OAUTH_TOKEN \}\}/)
  assert.doesNotMatch(review, /sk-ant-[A-Za-z0-9_-]{10,}/)
})

test('AI review skips forks and a missing secret visibly, and is not a required check', () => {
  assert.match(review, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/)
  assert.match(review, /steps\.secret\.outputs\.present == 'true'/)
  assert.match(review, /::warning::AI review skipped/)
  assert.match(review, /_Skipped: %s\._/)
  assert.ok(!jobs(review).some((j) => ['verify', 'human-gate'].includes(j)))
})

test('the model cannot publish: no comment or API tool; a shell step posts after a token scan', () => {
  const allowed = review.match(/--allowedTools "([^"]+)"/)[1]
  assert.doesNotMatch(allowed, /gh pr comment|gh api|Bash\(\*|WebFetch/)
  assert.match(review, /--disallowedTools "[^"]*Bash\(gh pr comment:\*\)/)
  assert.match(review, /grep -Eq 'sk-ant-/)
  assert.match(review, /printf '## AI code review/)
})
