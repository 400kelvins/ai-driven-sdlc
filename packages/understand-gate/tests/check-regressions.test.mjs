// Regression tests from the Story 2.2 AI review: a branch must not be able to pass the check by itself.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { LEDGER, appendLines, readLedger } from '../src/ledger.mjs'
import { parseArgs } from '../src/args.mjs'
import { DECK_AND_PACKAGE, tempRepo, ug } from './helpers.mjs'

const FILES = { 'slides.md': '# Talk', 'pages/a.md': '# A', 'packages/understand-gate/a.mjs': 'export {}' }

function onMain(files = FILES) {
  const repo = tempRepo(files)
  repo.git('branch', '-M', 'main')
  return repo
}
const commitAll = (repo, msg) => {
  repo.git('add', '-A')
  repo.git('commit', '-q', '-m', msg)
}
const yes = (dir, scope, decision = 'yes') =>
  ug(dir, 'record', '--scope', scope, '--stage', 'review', '--story', '9', '--decision', decision)

test('a branch that shrinks a scope in config.json is still judged by the base config', () => {
  const repo = onMain()
  repo.git('switch', '-q', '-c', 'feature')
  const weaker = structuredClone(DECK_AND_PACKAGE)
  weaker.scopes.package.include = ['packages/nothing/**']
  weaker.scopes.package.exclude = []
  repo.write({ '.understand-gate/config.json': JSON.stringify(weaker), 'packages/understand-gate/a.mjs': 'export const evil = 1' })
  repo.write({ 'packages/nothing/x.mjs': '' })
  commitAll(repo, 'shrink package scope')
  const out = ug(repo.dir, 'check', '--base', 'main')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /package: no review decision/)
})

test('a branch that removes an earlier no from the committed ledger fails', () => {
  const repo = onMain()
  yes(repo.dir, 'deck', 'no')
  commitAll(repo, 'ledger with a no')
  repo.git('switch', '-q', '-c', 'feature')
  repo.write({ 'pages/a.md': '# A, edited' })
  commitAll(repo, 'edit')
  writeFileSync(join(repo.dir, LEDGER), '')
  yes(repo.dir, 'deck')
  commitAll(repo, 'rewrite ledger and say yes')
  const out = ug(repo.dir, 'check', '--base', 'main')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /append-only/)
})

test('appending to the committed ledger is fine', () => {
  const repo = onMain()
  yes(repo.dir, 'deck', 'no')
  commitAll(repo, 'ledger with a no')
  repo.git('switch', '-q', '-c', 'feature')
  repo.write({ 'pages/a.md': '# A, edited' })
  commitAll(repo, 'edit')
  yes(repo.dir, 'deck')
  commitAll(repo, 'yes')
  const out = ug(repo.dir, 'check', '--base', 'main')
  assert.equal(out.status, 0, out.stderr)
})

test('check refuses a shallow clone', () => {
  const repo = onMain()
  repo.write({ 'pages/a.md': '# A, edited' })
  commitAll(repo, 'second')
  const clone = mkdtempSync(join(tmpdir(), 'ug-shallow-'))
  execFileSync('git', ['clone', '-q', '--depth', '1', `file://${repo.dir}`, clone])
  const out = ug(clone, 'check', '--base', 'HEAD')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /shallow/)
})

test('--all with a value, or with --base, is a usage error', () => {
  const { dir } = onMain()
  assert.equal(ug(dir, 'check', '--all', 'x').status, 2)
  assert.equal(ug(dir, 'check', '--all', '--base', 'main').status, 2)
})

test('ledger lines must be objects with text fields', () => {
  const { dir } = onMain()
  for (const bad of ['null', '[]', '7', '{"scope":"deck"}', '{"scope":1,"stage":"review","story":"1","decision":"yes","fingerprint":"x"}']) {
    writeFileSync(join(dir, LEDGER), bad + '\n')
    assert.throws(() => readLedger(dir), /line 1: needs/, bad)
  }
})

test('a ledger line cut short is reported, and the next record starts a fresh line', () => {
  const { dir } = onMain()
  writeFileSync(join(dir, LEDGER), '{"scope":"deck"')
  appendLines(dir, [{ scope: 'deck', stage: 'plan', story: '1', decision: 'yes', fingerprint: '0' }])
  const text = readFileSync(join(dir, LEDGER), 'utf8')
  assert.equal(text.split('\n')[1], '{"scope":"deck","stage":"plan","story":"1","decision":"yes","fingerprint":"0"}')
  assert.throws(() => readLedger(dir), /line 1: not valid JSON/)
})

test('a flag given twice, or a value flag with no value, is refused', () => {
  assert.throws(() => parseArgs(['--scope', 'a', '--scope', 'b']), /given twice/)
  const { dir } = onMain()
  for (const flag of ['--attempts', '--confidence', '--note']) {
    const out = ug(dir, 'record', '--scope', 'deck', '--stage', 'review', '--story', '1', '--decision', 'yes', flag)
    assert.equal(out.status, 1, flag)
    assert.match(out.stderr, new RegExp(`${flag} needs a value`))
  }
  const twice = ug(dir, 'record', '--scope', 'deck', '--scope', 'package', '--stage', 'review', '--story', '1', '--decision', 'yes')
  assert.equal(twice.status, 1)
  assert.match(twice.stderr, /given twice/)
})
