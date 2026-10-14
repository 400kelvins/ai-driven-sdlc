// Regression tests from the Story 2.1 AI review: every change to a file in a scope must move it.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chmodSync, mkdirSync, mkdtempSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { fingerprint } from '../src/fingerprint.mjs'
import { inScope, loadConfig, matches } from '../src/scopes.mjs'
import { tempRepo } from './helpers.mjs'

const BIN = fileURLToPath(new URL('../bin/understand-gate.mjs', import.meta.url))
const REPO = fileURLToPath(new URL('../../..', import.meta.url))
const fp = (repo, name = 'deck') => fingerprint(loadConfig(repo.dir).scopes[name], { cwd: repo.dir })

test('a staged rename out of the scope moves it', () => {
  const repo = tempRepo({ 'slides.md': '# Talk', 'scripts/x.mjs': '' })
  const before = fp(repo)
  repo.git('mv', 'slides.md', 'notes.md')
  assert.notEqual(fp(repo), before)
})

for (const name of ['pages/a\tb.md', 'pages/a\nb.md', 'pages/q"uote.md', 'pages/back\\slash.md', 'pages/ünï.md']) {
  test(`a file named ${JSON.stringify(name)} counts in its scope`, () => {
    const repo = tempRepo({ 'slides.md': '# Talk', [name]: 'one' })
    const before = fp(repo)
    repo.write({ [name]: 'two' })
    assert.notEqual(fp(repo), before)
  })
}

test('a file whose name has glob characters counts', () => {
  const repo = tempRepo({ 'slides.md': '# Talk', 'pages/[draft].md': 'one', 'pages/d.md': 'x' })
  const before = fp(repo)
  repo.write({ 'pages/[draft].md': 'two' })
  assert.notEqual(fp(repo), before)
})

test('swapping bytes between a new file name and its content moves the fingerprint', () => {
  const a = tempRepo({ 'slides.md': '# Talk' })
  a.write({ 'scripts/x': 'yz' })
  const b = tempRepo({ 'slides.md': '# Talk' })
  b.write({ 'scripts/xy': 'z' })
  assert.notEqual(fp(a), fp(b))
})

test('retargeting a new symlink moves the fingerprint, and a dangling one does not throw', () => {
  const repo = tempRepo({ 'slides.md': '# Talk', 'scripts/a.txt': 'same', 'scripts/b.txt': 'same' })
  symlinkSync('a.txt', join(repo.dir, 'scripts/link'))
  const before = fp(repo)
  unlinkSync(join(repo.dir, 'scripts/link'))
  symlinkSync('b.txt', join(repo.dir, 'scripts/link'))
  assert.notEqual(fp(repo), before)
  unlinkSync(join(repo.dir, 'scripts/link'))
  symlinkSync('missing.txt', join(repo.dir, 'scripts/link'))
  assert.match(fp(repo), /^[0-9a-f]{16}$/)
})

test('making a new file executable moves the fingerprint', () => {
  const repo = tempRepo({ 'slides.md': '# Talk' })
  repo.write({ 'scripts/run.sh': 'echo hi' })
  const before = fp(repo)
  chmodSync(join(repo.dir, 'scripts/run.sh'), 0o755)
  assert.notEqual(fp(repo), before)
})

test('a scope matching no files is an error, not a fingerprint that never moves', () => {
  const repo = tempRepo({ 'slides.md': '# Talk' }, { scopes: { typo: { include: ['packges/**'] } } })
  assert.throws(() => fp(repo, 'typo'), /matches no files/)
})

test('unsupported pattern forms are rejected', () => {
  for (const pattern of ['/slides.md', 'pages/', 'pages/[ab].md', 1, '', '!']) {
    const repo = tempRepo({ 'slides.md': '# Talk' })
    repo.write({ '.understand-gate/config.json': JSON.stringify({ scopes: { s: { include: [pattern] } } }) })
    assert.throws(() => loadConfig(repo.dir), /pattern/, String(pattern))
  }
})

test('? and a/**/b match as documented', () => {
  assert.ok(matches('a/?.md', 'a/b.md'))
  assert.ok(!matches('a/?.md', 'a/bc.md'))
  assert.ok(matches('a/**/b', 'a/b'))
  assert.ok(matches('a/**/b', 'a/x/y/b'))
  assert.ok(matches('a.md', 'a.md') && !matches('a.md', 'axmd'))
})

test('the CLI gives the same fingerprint from a subfolder', () => {
  const repo = tempRepo({ 'slides.md': '# Talk', 'scripts/x.mjs': '' })
  const top = spawnSync(process.execPath, [BIN, 'fingerprint', '--scope', 'deck'], { cwd: repo.dir, encoding: 'utf8' })
  const sub = spawnSync(process.execPath, [BIN, 'fingerprint', '--scope', 'deck'], { cwd: join(repo.dir, 'scripts'), encoding: 'utf8' })
  assert.equal(sub.status, 0, sub.stderr)
  assert.equal(sub.stdout, top.stdout)
})

test('outside a git repo the CLI exits 1 with git\'s reason', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ug-norepo-'))
  mkdirSync(join(dir, '.understand-gate'))
  writeFileSync(join(dir, '.understand-gate/config.json'), '{"scopes":{"deck":{"include":["**"]}}}')
  const out = spawnSync(process.execPath, [BIN, 'fingerprint', '--scope', 'deck'], {
    cwd: dir,
    encoding: 'utf8',
    env: { ...process.env, GIT_CEILING_DIRECTORIES: tmpdir() },
  })
  assert.equal(out.status, 1)
  assert.match(out.stderr, /not a git repository/)
  assert.equal(out.stderr.trim().split('\n').length, 1)
})

test('this repo\'s config puts sample paths in the right scope', () => {
  const { scopes } = loadConfig(REPO)
  const deck = ['slides.md', 'pages/talk.md', 'pages/deep/x.md', 'scripts/gate.mjs', '.specify/extensions.yml', '.understand-gate/config.json']
  const neither = ['README.md', 'specs/011-package-scopes/spec.md', '_bmad-output/x/gates.jsonl', '.claude/skills/a/SKILL.md', '.understand-gate/gates.jsonl']
  for (const path of deck) assert.ok(inScope(path, scopes.deck) && !inScope(path, scopes.package), path)
  for (const path of neither) assert.ok(!inScope(path, scopes.deck) && !inScope(path, scopes.package), path)
  assert.ok(inScope('packages/understand-gate/src/scopes.mjs', scopes.package))
  assert.ok(!inScope('packages/understand-gate/src/scopes.mjs', scopes.deck))
})
