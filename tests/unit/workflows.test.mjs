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

test('every action is pinned to an exact version', () => {
  for (const ref of [...uses(ci), ...uses(review)]) assert.match(ref, /@v\d+\.\d+\.\d+$/, ref)
})

test('AI review uses the pinned action and the token only from secrets', () => {
  assert.ok(uses(review).includes('anthropics/claude-code-action@v1.0.237'))
  assert.match(review, /claude_code_oauth_token: \$\{\{ secrets\.CLAUDE_CODE_OAUTH_TOKEN \}\}/)
  assert.doesNotMatch(review, /sk-ant-/)
})

test('AI review skips forks and a missing secret, and is not a required check', () => {
  assert.match(review, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/)
  assert.match(review, /steps\.secret\.outputs\.present == 'true'/)
  assert.ok(!jobs(review).some((j) => ['verify', 'human-gate'].includes(j)))
})

test('AI review posts a comment the gate pack can find', () => {
  assert.match(review, /## AI code review/)
})
