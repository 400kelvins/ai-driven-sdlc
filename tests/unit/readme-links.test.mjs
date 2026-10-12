import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const readme = readFileSync(`${ROOT}README.md`, 'utf8')

test('every relative link in README.md points to an existing path', () => {
  const targets = [...readme.matchAll(/\]\(([^)]+)\)/g)]
    .map((m) => m[1])
    .filter((t) => !/^(https?:|mailto:|#)/.test(t))
  assert.ok(targets.length >= 8, 'expected the artifact map to link several files')
  const missing = targets.filter((t) => !existsSync(`${ROOT}${t.split('#')[0]}`))
  assert.deepEqual(missing, [])
})
