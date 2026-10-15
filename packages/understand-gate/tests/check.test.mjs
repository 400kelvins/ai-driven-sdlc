import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tempRepo, ug } from './helpers.mjs'

const FILES = { 'slides.md': '# Talk', 'pages/a.md': '# A', 'packages/understand-gate/a.mjs': 'export {}', 'specs/1/spec.md': '# Spec' }

/** A repo on `main`, then a feature branch with `changes` committed. */
function branch(changes) {
  const repo = tempRepo(FILES)
  repo.git('branch', '-M', 'main')
  repo.git('switch', '-q', '-c', 'feature')
  if (changes) {
    repo.write(changes)
    repo.git('add', '-A')
    repo.git('commit', '-q', '-m', 'change')
  }
  return repo
}

const yes = (dir, scope, decision = 'yes') =>
  ug(dir, 'record', '--scope', scope, '--stage', 'review', '--story', '9', '--decision', decision)
const check = (dir, ...more) => ug(dir, 'check', '--base', 'main', ...more)

test('a deck-only branch passes with a deck yes, whatever the package state', () => {
  const { dir } = branch({ 'pages/a.md': '# A, edited' })
  assert.equal(check(dir).status, 1)
  yes(dir, 'deck')
  const out = check(dir)
  assert.equal(out.status, 0, out.stderr)
  assert.match(out.stdout, /deck/)
  assert.doesNotMatch(out.stdout, /package/)
})

test('a branch touching both scopes fails naming the one without a yes', () => {
  const { dir } = branch({ 'pages/a.md': '# A, edited', 'packages/understand-gate/a.mjs': 'export const b = 1' })
  yes(dir, 'deck')
  const out = check(dir)
  assert.equal(out.status, 1)
  assert.match(out.stderr, /package: no review decision/)
  assert.doesNotMatch(out.stderr, /deck:/)
  yes(dir, 'package')
  assert.equal(check(dir).status, 0)
})

test('a change after the yes fails with the old and new fingerprints', () => {
  const repo = branch({ 'pages/a.md': '# A, edited' })
  yes(repo.dir, 'deck')
  repo.write({ 'pages/a.md': '# A, edited again' })
  repo.git('commit', '-qam', 'again')
  const out = check(repo.dir)
  assert.equal(out.status, 1)
  assert.match(out.stderr, /deck: code changed since the review yes \(approved [0-9a-f]{16}, now [0-9a-f]{16}\)/)
})

test('the latest review decision wins: a later no fails even after a matching yes', () => {
  const { dir } = branch({ 'pages/a.md': '# A, edited' })
  yes(dir, 'deck')
  yes(dir, 'deck', 'no')
  const out = check(dir)
  assert.equal(out.status, 1)
  assert.match(out.stderr, /deck: latest review decision \(story 9\) was "no"/)
})

test('plan and implement decisions do not satisfy the check', () => {
  const { dir } = branch({ 'pages/a.md': '# A, edited' })
  ug(dir, 'record', '--scope', 'deck', '--stage', 'implement', '--story', '9', '--decision', 'yes')
  assert.equal(check(dir).status, 1)
})

test('a branch touching no scope passes and says so', () => {
  const { dir } = branch({ 'specs/1/spec.md': '# Spec, edited' })
  const out = check(dir)
  assert.equal(out.status, 0, out.stderr)
  assert.match(out.stdout, /no scope touched/)
})

test('uncommitted changes count as touched', () => {
  const repo = branch()
  repo.write({ 'packages/understand-gate/a.mjs': 'export const c = 1' })
  const out = check(repo.dir)
  assert.equal(out.status, 1)
  assert.match(out.stderr, /package/)
})

test('a rename out of a scope touches the scope it left', () => {
  const repo = branch()
  repo.git('mv', 'pages/a.md', 'specs/1/a.md')
  repo.git('commit', '-qm', 'move')
  const out = check(repo.dir)
  assert.equal(out.status, 1)
  assert.match(out.stderr, /deck/)
})

test('--all needs a matching yes for every scope', () => {
  const { dir } = branch({ 'pages/a.md': '# A, edited' })
  yes(dir, 'deck')
  assert.equal(check(dir).status, 0)
  const all = ug(dir, 'check', '--all')
  assert.equal(all.status, 1)
  assert.match(all.stderr, /package/)
  yes(dir, 'package')
  assert.equal(ug(dir, 'check', '--all').status, 0)
})

test('check needs --base or --all, and an unknown base fails in one line', () => {
  const { dir } = branch()
  assert.equal(ug(dir, 'check').status, 2)
  const out = ug(dir, 'check', '--base', 'nope')
  assert.equal(out.status, 1)
  assert.equal(out.stderr.trim().split('\n').length, 1)
})
