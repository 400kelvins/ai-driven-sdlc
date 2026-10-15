// read-listen-see is understand-gate under another name: same output, same exit code.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { tempRepo, ug } from './helpers.mjs'

const ALIAS = fileURLToPath(new URL('../../read-listen-see/bin/read-listen-see.mjs', import.meta.url))
const alias = (cwd, ...args) => spawnSync(process.execPath, [ALIAS, ...args], { cwd, encoding: 'utf8' })

test('read-listen-see gives the same output and exit code as understand-gate', () => {
  const { dir } = tempRepo({ 'slides.md': '# Talk' })
  for (const args of [['fingerprint', '--scope', 'deck'], ['fingerprint', '--scope', 'nope'], ['stats'], []]) {
    const a = alias(dir, ...args)
    const u = ug(dir, ...args)
    assert.equal(a.status, u.status, args.join(' '))
    assert.equal(a.stdout, u.stdout, args.join(' '))
    assert.equal(a.stderr, u.stderr, args.join(' '))
  }
})
