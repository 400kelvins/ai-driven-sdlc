import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const readme = readFileSync(`${ROOT}README.md`, 'utf8')
const tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n')

// Relative targets from inline links and <img src>; a clone of the repo must contain each one
const targets = [
  ...[...readme.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]),
  ...[...readme.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]),
]
  .filter((t) => !/^(https?:|mailto:|#)/.test(t))
  .map((t) => t.split('#')[0].replace(/\/$/, ''))

test('every relative README link is tracked in git, so it exists in any clone', () => {
  const missing = targets.filter((t) => !tracked.some((f) => f === t || f.startsWith(`${t}/`)))
  assert.deepEqual(missing, [])
})

test('README links the core artifacts', () => {
  for (const must of [
    '_bmad-output/initiative-ai-driven-sdlc/prd-ai-driven-sdlc/prd-ai-driven-sdlc.md',
    '_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/gates.jsonl',
    'specs',
    '.specify/memory/constitution.md',
    'templates/gate-review-pack.md',
    'LICENSE',
  ]) assert.ok(targets.includes(must), must)
})
