import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { tempRepo } from './helpers.mjs'

const BIN = fileURLToPath(new URL('../bin/understand-gate.mjs', import.meta.url))
const run = (cwd, ...args) => spawnSync(process.execPath, [BIN, ...args], { cwd, encoding: 'utf8' })

test('fingerprint --scope prints 16 hex characters and exits 0', () => {
  const { dir } = tempRepo({ 'slides.md': '# Talk' })
  const out = run(dir, 'fingerprint', '--scope', 'deck')
  assert.equal(out.status, 0, out.stderr)
  assert.match(out.stdout.trim(), /^[0-9a-f]{16}$/)
})

test('an unknown scope exits 1 and names the known scopes', () => {
  const { dir } = tempRepo({ 'slides.md': '# Talk' })
  const out = run(dir, 'fingerprint', '--scope', 'nope')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /nope/)
  assert.match(out.stderr, /deck, package/)
  assert.equal(out.stderr.trim().split('\n').length, 1)
})

test('an invalid config exits 1 with one line', () => {
  const repo = tempRepo({ 'slides.md': '# Talk' })
  repo.write({ '.understand-gate/config.json': '{ not json' })
  const out = run(repo.dir, 'fingerprint', '--scope', 'deck')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /config\.json/)
  assert.equal(out.stderr.trim().split('\n').length, 1)
})

test('a missing config exits 1', () => {
  const repo = tempRepo({ 'slides.md': '# Talk' })
  repo.git('rm', '-q', '.understand-gate/config.json')
  const out = run(repo.dir, 'fingerprint', '--scope', 'deck')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /config\.json/)
})

test('no scope, or no command, exits 2 with usage', () => {
  const { dir } = tempRepo({ 'slides.md': '# Talk' })
  for (const args of [['fingerprint'], [], ['what']]) {
    const out = run(dir, ...args)
    assert.equal(out.status, 2, args.join(' '))
    assert.match(out.stderr, /Usage/)
  }
})
