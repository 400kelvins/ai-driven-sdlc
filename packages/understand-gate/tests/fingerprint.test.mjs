import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { fingerprint } from '../src/fingerprint.mjs'
import { loadConfig } from '../src/scopes.mjs'
import { tempRepo } from './helpers.mjs'

const FILES = {
  'slides.md': '# Talk',
  'pages/talk.md': '# Slide',
  'scripts/x.mjs': 'export {}',
  'packages/understand-gate/src/a.mjs': 'export const a = 1',
  'specs/001/spec.md': '# Spec',
}

function both(dir) {
  const { scopes } = loadConfig(dir)
  return { deck: fingerprint(scopes.deck, { cwd: dir }), pkg: fingerprint(scopes.package, { cwd: dir }) }
}

test('a fingerprint is 16 hex characters', () => {
  const { dir } = tempRepo(FILES)
  assert.match(both(dir).deck, /^[0-9a-f]{16}$/)
})

test('a committed slide change moves deck only', () => {
  const repo = tempRepo(FILES)
  const before = both(repo.dir)
  repo.write({ 'pages/talk.md': '# Slide, edited' })
  repo.git('commit', '-qam', 'slide')
  const after = both(repo.dir)
  assert.notEqual(after.deck, before.deck)
  assert.equal(after.pkg, before.pkg)
})

test('an uncommitted package change moves package only', () => {
  const repo = tempRepo(FILES)
  const before = both(repo.dir)
  repo.write({ 'packages/understand-gate/src/a.mjs': 'export const a = 2' })
  const after = both(repo.dir)
  assert.equal(after.deck, before.deck)
  assert.notEqual(after.pkg, before.pkg)
})

test('a planning document change moves neither', () => {
  const repo = tempRepo(FILES)
  const before = both(repo.dir)
  repo.write({ 'specs/001/spec.md': '# Spec, edited', 'specs/002/spec.md': '# New spec' })
  assert.deepEqual(both(repo.dir), before)
})

test('a new untracked file in a scope moves it', () => {
  const repo = tempRepo(FILES)
  const before = both(repo.dir)
  repo.write({ 'packages/understand-gate/src/b.mjs': 'export const b = 1' })
  assert.notEqual(both(repo.dir).pkg, before.pkg)
})

test('a deleted file in a scope moves it', () => {
  const repo = tempRepo(FILES)
  const before = both(repo.dir)
  rmSync(join(repo.dir, 'scripts/x.mjs'))
  assert.notEqual(both(repo.dir).deck, before.deck)
})

test('the same contents give the same fingerprint', () => {
  const repo = tempRepo(FILES)
  const before = both(repo.dir)
  repo.write({ 'pages/talk.md': '# changed' })
  repo.write({ 'pages/talk.md': '# Slide' })
  assert.deepEqual(both(repo.dir), before)
})
