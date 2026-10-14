import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { LEDGER } from '../src/ledger.mjs'
import { stats } from '../src/stats.mjs'
import { tempRepo, ug } from './helpers.mjs'

const line = (o) => JSON.stringify({ ts: '2026-10-15T00:00:00.000Z', scope: 'deck', stage: 'review', story: '1', decision: 'yes',
  fingerprint: '0123456789abcdef', proof: null, attempts: null, firstTry: null, confidence: null, note: null, ...o })

const FIXTURE = [
  line({ stage: 'plan', attempts: 1, firstTry: true }),
  line({ stage: 'implement', attempts: 2, firstTry: false }),
  line({ stage: 'review', attempts: 3, firstTry: false }),
  line({ stage: 'review', decision: 'no' }),
  line({ stage: 'plan', attempts: 1, firstTry: true, scope: 'package' }),
]

test('stats counts first-try passes, re-explanations, and no decisions', () => {
  const s = stats(FIXTURE.map((l) => JSON.parse(l)))
  assert.deepEqual(s, { decisions: 5, no: 1, quizzed: 4, firstTry: 2, reExplanations: 3 })
})

test('the stats command prints the first-try rate', () => {
  const { dir } = tempRepo({ 'slides.md': '# Talk' })
  mkdirSync(join(dir, '.understand-gate'), { recursive: true })
  writeFileSync(join(dir, LEDGER), FIXTURE.join('\n') + '\n')
  const out = ug(dir, 'stats')
  assert.equal(out.status, 0, out.stderr)
  assert.match(out.stdout, /decisions 5/)
  assert.match(out.stdout, /no 1/)
  assert.match(out.stdout, /first-try quiz passes 2\/4 \(50%\)/)
  assert.match(out.stdout, /re-explanations 3/)
})

test('stats on an empty ledger says there is nothing yet', () => {
  const { dir } = tempRepo({ 'slides.md': '# Talk' })
  const out = ug(dir, 'stats')
  assert.equal(out.status, 0, out.stderr)
  assert.match(out.stdout, /no decisions recorded/)
})
