import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tempRepo, ug } from './helpers.mjs'

const FILES = { 'slides.md': '# Talk', 'pages/a.md': '# A', 'packages/understand-gate/a.mjs': 'export {}', 'specs/1/spec.md': '# S' }

function branch(changes) {
  const repo = tempRepo(FILES)
  repo.git('branch', '-M', 'main')
  repo.git('switch', '-q', '-c', 'feature')
  repo.write(changes)
  repo.git('add', '-A')
  repo.git('commit', '-q', '-m', 'change')
  return repo
}

test('touched prints each touched scope on its own line', () => {
  const { dir } = branch({ 'pages/a.md': '# edited', 'packages/understand-gate/a.mjs': 'export const x = 1' })
  const out = ug(dir, 'touched', '--base', 'main')
  assert.equal(out.status, 0, out.stderr)
  assert.deepEqual(out.stdout.trim().split('\n'), ['deck', 'package'])
})

test('touched prints nothing for a docs-only branch', () => {
  const { dir } = branch({ 'specs/1/spec.md': '# edited' })
  const out = ug(dir, 'touched', '--base', 'main')
  assert.equal(out.status, 0, out.stderr)
  assert.equal(out.stdout, '')
})

test('touched uses the base config, like check', () => {
  const { dir } = branch({ 'packages/understand-gate/a.mjs': 'export const y = 1', '.understand-gate/config.json': '{"scopes":{"deck":{"include":["slides.md"]}}}' })
  assert.match(ug(dir, 'touched', '--base', 'main').stdout, /package/)
})

test('touched without --base is a usage error', () => {
  const { dir } = branch({ 'pages/a.md': '# edited' })
  assert.equal(ug(dir, 'touched').status, 2)
})

test('a branch from before the config existed is refused, not judged by its own config', () => {
  const repo = tempRepo({ 'slides.md': '# Talk' })
  repo.git('branch', '-M', 'main')
  repo.git('rm', '-q', '.understand-gate/config.json')
  repo.git('commit', '-qm', 'no config yet')
  repo.git('switch', '-q', '-c', 'feature')
  repo.write({ '.understand-gate/config.json': '{"scopes":{"docs":{"include":["specs/**"]}}}', 'slides.md': '# edited' })
  repo.git('add', '-A')
  repo.git('commit', '-qm', 'own config')
  for (const cmd of [['touched', '--base', 'main'], ['check', '--base', 'main']]) {
    const out = ug(repo.dir, ...cmd)
    assert.equal(out.status, 1, cmd[0])
    assert.match(out.stderr, /not found at the merge base/)
  }
})
