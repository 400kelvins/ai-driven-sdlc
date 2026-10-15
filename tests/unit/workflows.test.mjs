import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDocument } from 'yaml'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const ci = readFileSync(`${ROOT}.github/workflows/ci.yml`, 'utf8')
const review = readFileSync(`${ROOT}.github/workflows/claude-review.yml`, 'utf8')
const visuals = readFileSync(`${ROOT}.github/workflows/pr-visuals.yml`, 'utf8')
const gate = readFileSync(`${ROOT}.github/workflows/understand-gate.yml`, 'utf8')
const ALL = [ci, review, visuals, gate]

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

test('CI runs the same deck checks as npm run verify, the package tests, and the gate check', () => {
  assert.match(ci, /run: npm run verify:deck/)
  assert.match(ci, /run: npm test -w understand-gate/)
  assert.match(ci, /run: npm run gate:check/)
})

test('verify tests only the touched scopes on a PR, everything on a push, and always reports', () => {
  const verify = ci.split(/^ {2}verify:/m)[1].split(/^ {2}human-gate:/m)[0]
  assert.doesNotMatch(verify, /^ {4}if:/m, 'the job itself must always run')
  assert.match(verify, /fetch-depth: 0/)
  assert.match(verify, /touched --base "\$BASE_SHA"/)
  assert.match(verify, /"\$EVENT" = push/)
  for (const step of ['npm ci', 'npx playwright install --with-deps chromium', 'npm run verify:deck']) {
    assert.match(verify, new RegExp(`if: steps\\.areas\\.outputs\\.deck == 'true'\\n\\s+run: ${step.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}`), step)
  }
  assert.match(verify, /if: steps\.areas\.outputs\.package == 'true'\n\s+run: npm test -w understand-gate/)
})

test('understand-gate runs from main: pull_request_target, read-only, and the PR head only as data', () => {
  assert.match(gate, /^on:\n {2}pull_request_target:\n {4}branches: \[main\]/m)
  assert.deepEqual(jobs(gate), ['understand-gate'])
  assert.match(gate, /^permissions:\n {2}contents: read\n\n/m)
  assert.doesNotMatch(gate, /permissions:[\s\S]*write/)
  assert.match(gate, /if: github\.event\.pull_request\.head\.repo\.full_name == github\.repository/)
  assert.match(gate, /ref: \$\{\{ github\.event\.pull_request\.base\.sha \}\}\n\s+path: base/)
  assert.match(gate, /ref: \$\{\{ github\.event\.pull_request\.head\.sha \}\}\n\s+path: head\n\s+fetch-depth: 0/)
  const runs = [...gate.matchAll(/^\s+run: (.*)$/gm)].map((m) => m[1])
  assert.deepEqual(runs, ['node ../base/packages/understand-gate/bin/understand-gate.mjs check --base "$BASE_SHA"'])
  assert.doesNotMatch(gate, /npm (ci|install|run)/)
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

test('branch protection requires every check, up to date, for admins too', () => {
  const p = JSON.parse(readFileSync(`${ROOT}.github/branch-protection.json`, 'utf8'))
  // Pinned to the GitHub Actions app (15368), so no other app or token can post a green check
  const required = [...jobs(ci), ...jobs(gate)].map((context) => ({ context, app_id: 15368 }))
  assert.deepEqual(p.required_status_checks, { strict: true, checks: required })
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

// Runs the publish job's "Validate the artifact" step on a crafted folder; returns its ok output
function validate(files, { manifest, symlinkManifest = false } = {}) {
  const step = parseDocument(visuals).toJS().jobs.publish.steps.find((s) => s.name === 'Validate the artifact')
  const root = mkdtempSync(join(tmpdir(), 'artifact-'))
  const art = join(root, 'art')
  mkdirSync(art)
  for (const [name, body] of Object.entries(files)) {
    if (body === 'LINK') symlinkSync('/etc/hosts', join(art, name))
    else writeFileSync(join(art, name), body)
  }
  if (manifest) {
    if (symlinkManifest) {
      writeFileSync(join(root, 'real.json'), JSON.stringify(manifest))
      symlinkSync(join(root, 'real.json'), join(art, 'manifest.json'))
    } else writeFileSync(join(art, 'manifest.json'), JSON.stringify(manifest))
  }
  const out = join(root, 'out')
  writeFileSync(out, '')
  execFileSync('bash', ['-c', step.run], { cwd: root, env: { ...process.env, GITHUB_OUTPUT: out }, stdio: 'ignore' })
  return readFileSync(out, 'utf8').trim()
}

const PNG = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.from('image')])
const one = { total: 21, baseMissing: false, changes: [{ slide: 3, kind: 'changed' }] }

test('artifact check accepts images that match the manifest exactly', () => {
  assert.equal(validate({ '003-before.png': PNG, '003-after.png': PNG }, { manifest: one }), 'ok=true')
  assert.equal(validate({}, { manifest: { total: 21, baseMissing: false, changes: [] } }), 'ok=true')
  const added = { total: 22, baseMissing: false, changes: [{ slide: 22, kind: 'new' }] }
  assert.equal(validate({ '022-after.png': PNG }, { manifest: added }), 'ok=true')
})

test('artifact check rejects anything else', () => {
  const pair = { '003-before.png': PNG, '003-after.png': PNG }
  assert.equal(validate(pair), 'ok=false', 'no manifest')
  assert.equal(validate({ ...pair, 'evil.sh': 'echo pwned' }, { manifest: one }), 'ok=false', 'extra file')
  assert.equal(validate({ ...pair, '.hidden': 'x' }, { manifest: one }), 'ok=false', 'hidden file')
  assert.equal(validate({ ...pair, '..x': 'x' }, { manifest: one }), 'ok=false', 'double-dot hidden file')
  assert.equal(validate({ '003-before.png': PNG, '003-after.png': 'not a png' }, { manifest: one }), 'ok=false', 'bad signature')
  assert.equal(validate({ '003-before.png': PNG, '003-after.png': 'LINK' }, { manifest: one }), 'ok=false', 'symlinked image')
  assert.equal(validate(pair, { manifest: one, symlinkManifest: true }), 'ok=false', 'symlinked manifest')
  assert.equal(validate({ '003-after.png': PNG }, { manifest: one }), 'ok=false', 'missing before image')
  assert.equal(validate(pair, { manifest: { ...one, changes: [{ slide: 3, kind: 'changed', x: 'y' }] } }), 'ok=false', 'extra key')
  assert.equal(validate(pair, { manifest: { ...one, changes: [{ slide: '3', kind: 'changed' }] } }), 'ok=false', 'string slide')
  assert.equal(validate(pair, { manifest: { ...one, changes: [{ slide: 3, kind: '$(id)' }] } }), 'ok=false', 'bad kind')
  assert.equal(validate({ ...pair, '004-after.png': Buffer.concat([PNG, Buffer.alloc(2_200_000)]) }, { manifest: one }), 'ok=false', 'oversize')
})
