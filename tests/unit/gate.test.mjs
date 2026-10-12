import { test } from 'node:test'
import assert from 'node:assert/strict'
import { approved, fingerprint, isCode, parseArgs } from '../../scripts/gate.mjs'

const yes = (stage, fp, story = '7') => ({ stage, story, decision: 'yes', fingerprint: fp })
const no = (stage, fp, story = '7') => ({ stage, story, decision: 'no', fingerprint: fp })

test('no decision blocks', () => {
  assert.equal(approved([], 'review', 'abc').ok, false)
})

test('yes for the same code passes', () => {
  assert.equal(approved([yes('review', 'abc')], 'review', 'abc').ok, true)
})

test('code changed after yes blocks', () => {
  const r = approved([yes('review', 'abc')], 'review', 'def')
  assert.equal(r.ok, false)
  assert.match(r.reason, /code changed/)
})

test('latest decision wins: a later no blocks', () => {
  assert.equal(approved([yes('review', 'abc'), no('review', 'abc')], 'review', 'abc').ok, false)
})

test('other stages do not count for review', () => {
  assert.equal(approved([yes('plan', 'abc'), yes('implement', 'abc')], 'review', 'abc').ok, false)
})

test('fingerprint is stable and short', () => {
  assert.equal(fingerprint(), fingerprint())
  assert.match(fingerprint(), /^[0-9a-f]{16}$/)
})

test('parses flags', () => {
  assert.deepEqual(parseArgs(['--stage', 'review', '--decision', 'yes', '--story', '7']), {
    stage: 'review', decision: 'yes', story: '7',
  })
})

test('slides and code ship; planning docs do not', () => {
  for (const p of ['slides.md', 'pages/talk.md', 'scripts/gate.mjs', 'components/Flow.vue', 'package.json']) {
    assert.equal(isCode(p), true, p)
  }
  for (const p of ['_bmad-output/x/gates.jsonl', 'specs/001/spec.md', '.specify/memory/constitution.md', 'README.md', 'public/demo/README.md']) {
    assert.equal(isCode(p), false, p)
  }
})
