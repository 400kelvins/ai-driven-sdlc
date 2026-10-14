import { test } from 'node:test'
import assert from 'node:assert/strict'
import { matches, inScope } from '../src/scopes.mjs'
import { DECK_AND_PACKAGE } from './helpers.mjs'

const { deck, package: pkg } = DECK_AND_PACKAGE.scopes

test('* stays inside one folder, ** crosses folders', () => {
  assert.ok(matches('pages/*.md', 'pages/talk.md'))
  assert.ok(!matches('pages/*.md', 'pages/deep/talk.md'))
  assert.ok(matches('packages/**', 'packages/a/b/c.mjs'))
  assert.ok(matches('**/*.md', 'README.md'))
  assert.ok(matches('**/*.md', 'docs/a/b.md'))
  assert.ok(matches('**', 'any/path.js'))
})

test('patterns match the whole path, not a prefix or a suffix', () => {
  assert.ok(!matches('slides.md', 'old/slides.md'))
  assert.ok(!matches('specs/**', 'notspecs/a.md'))
})

test('the last matching exclude wins and ! re-includes', () => {
  assert.ok(inScope('slides.md', deck))
  assert.ok(inScope('pages/talk.md', deck))
  assert.ok(!inScope('README.md', deck))
  assert.ok(!inScope('specs/011-package-scopes/spec.md', deck))
  assert.ok(inScope('.understand-gate/config.json', deck))
  assert.ok(!inScope('.understand-gate/gates.jsonl', deck))
})

test('deck and package do not overlap on sample paths', () => {
  for (const path of ['scripts/gate.mjs', 'tests/unit/gate.test.mjs', 'package.json', 'components/Flow.vue']) {
    assert.ok(inScope(path, deck), path)
    assert.ok(!inScope(path, pkg), path)
  }
  for (const path of ['packages/understand-gate/src/scopes.mjs', 'packages/understand-gate/README.md']) {
    assert.ok(inScope(path, pkg), path)
    assert.ok(!inScope(path, deck), path)
  }
})
