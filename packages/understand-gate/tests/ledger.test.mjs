import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { LEDGER, readLedger } from '../src/ledger.mjs'
import { inScope, loadConfig } from '../src/scopes.mjs'
import { tempRepo, ug } from './helpers.mjs'

const FILES = { 'slides.md': '# Talk', 'packages/understand-gate/a.mjs': 'export {}' }
const lines = (dir) => readFileSync(join(dir, LEDGER), 'utf8').trim().split('\n').map((l) => JSON.parse(l))

test('record writes one line per scope with that scope fingerprint', () => {
  const { dir } = tempRepo(FILES)
  const out = ug(dir, 'record', '--scope', 'deck,package', '--stage', 'review', '--story', '2.2', '--decision', 'yes',
    '--attempts', '2', '--first-try', 'no', '--confidence', '4', '--note', 'took two tries')
  assert.equal(out.status, 0, out.stderr)
  const [deck, pkg] = lines(dir)
  assert.equal(deck.scope, 'deck')
  assert.equal(pkg.scope, 'package')
  assert.equal(deck.fingerprint, ug(dir, 'fingerprint', '--scope', 'deck').stdout.trim())
  assert.equal(pkg.fingerprint, ug(dir, 'fingerprint', '--scope', 'package').stdout.trim())
  assert.deepEqual(Object.keys(deck), ['ts', 'scope', 'stage', 'story', 'decision', 'fingerprint', 'proof', 'attempts', 'firstTry', 'confidence', 'note'])
  assert.equal(deck.proof, null)
  assert.equal(deck.attempts, 2)
  assert.equal(deck.firstTry, false)
  assert.equal(deck.confidence, 4)
  assert.equal(deck.note, 'took two tries')
})

test('optional fields are null when not given', () => {
  const { dir } = tempRepo(FILES)
  ug(dir, 'record', '--scope', 'deck', '--stage', 'plan', '--story', '1', '--decision', 'no')
  const [line] = lines(dir)
  assert.equal(line.attempts, null)
  assert.equal(line.firstTry, null)
  assert.equal(line.confidence, null)
  assert.equal(line.note, null)
})

test('record refuses a scope with uncommitted changes and names the files', () => {
  const repo = tempRepo(FILES)
  repo.write({ 'pages/new.md': '# New' })
  const out = ug(repo.dir, 'record', '--scope', 'deck', '--stage', 'review', '--story', '1', '--decision', 'yes')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /pages\/new\.md/)
  assert.match(out.stderr, /[Cc]ommit/)
})

test('uncommitted changes in another scope do not block recording', () => {
  const repo = tempRepo(FILES)
  repo.write({ 'packages/understand-gate/a.mjs': 'export const changed = 1' })
  const out = ug(repo.dir, 'record', '--scope', 'deck', '--stage', 'review', '--story', '1', '--decision', 'yes')
  assert.equal(out.status, 0, out.stderr)
})

test('record refuses bad input with one line', () => {
  const { dir } = tempRepo(FILES)
  const record = (over) => {
    const fields = { scope: 'deck', stage: 'review', story: '1', decision: 'yes', ...over }
    return ug(dir, 'record', ...Object.entries(fields).filter(([, v]) => v !== undefined).flatMap(([k, v]) => [`--${k}`, v]))
  }
  const bad = [
    [{ stage: 'ship' }, /stage/],
    [{ decision: 'maybe' }, /decision/],
    [{ scope: 'nope' }, /nope/],
    [{ confidence: '6' }, /confidence/],
    [{ confidence: 'x' }, /confidence/],
    [{ attempts: '0' }, /attempts/],
    [{ 'first-try': 'perhaps' }, /first-try/],
    [{ story: undefined }, /story/],
  ]
  for (const [over, pattern] of bad) {
    const out = record(over)
    assert.equal(out.status, 1, `${JSON.stringify(over)}: ${out.stderr}`)
    assert.match(out.stderr, pattern)
    assert.equal(out.stderr.trim().split('\n').length, 1)
  }
})

test('a new record leaves earlier lines unchanged', () => {
  const { dir } = tempRepo(FILES)
  ug(dir, 'record', '--scope', 'deck', '--stage', 'plan', '--story', '1', '--decision', 'yes')
  const first = readFileSync(join(dir, LEDGER), 'utf8')
  ug(dir, 'record', '--scope', 'deck', '--stage', 'review', '--story', '1', '--decision', 'yes')
  assert.ok(readFileSync(join(dir, LEDGER), 'utf8').startsWith(first))
  assert.equal(lines(dir).length, 2)
})

test('a malformed ledger line is reported with its number', () => {
  const { dir } = tempRepo(FILES)
  ug(dir, 'record', '--scope', 'deck', '--stage', 'plan', '--story', '1', '--decision', 'yes')
  writeFileSync(join(dir, LEDGER), readFileSync(join(dir, LEDGER), 'utf8') + '{ broken\n')
  assert.throws(() => readLedger(dir), /gates\.jsonl line 2/)
})

test('the ledger is never in a scope, even one that includes everything', () => {
  const { dir } = tempRepo(FILES)
  assert.ok(!inScope(LEDGER, { include: ['**'], exclude: [] }))
  const before = ug(dir, 'fingerprint', '--scope', 'deck').stdout
  ug(dir, 'record', '--scope', 'deck', '--stage', 'plan', '--story', '1', '--decision', 'yes')
  assert.equal(ug(dir, 'fingerprint', '--scope', 'deck').stdout, before)
  assert.ok(loadConfig(dir))
})
