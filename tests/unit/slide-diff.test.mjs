import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { diff } from '../../scripts/slide-diff.mjs'

const SCRIPT = fileURLToPath(new URL('../../scripts/slide-diff.mjs', import.meta.url))
const shots = (obj) => new Map(Object.entries(obj).map(([n, s]) => [Number(n), Buffer.from(s)]))

test('identical decks have no changes', () => {
  assert.deepEqual(diff(shots({ 1: 'a', 2: 'b' }), shots({ 1: 'a', 2: 'b' })), { total: 2, baseMissing: false, changes: [] })
})

test('a slide whose image differs is changed', () => {
  assert.deepEqual(diff(shots({ 1: 'a', 2: 'b' }), shots({ 1: 'a', 2: 'B' })).changes, [{ slide: 2, kind: 'changed' }])
})

test('head-only slides are new, base-only slides are removed', () => {
  assert.deepEqual(diff(shots({ 1: 'a', 2: 'b' }), shots({ 1: 'a', 3: 'c' })).changes, [
    { slide: 2, kind: 'removed' },
    { slide: 3, kind: 'new' },
  ])
})

test('an empty base marks every head slide new', () => {
  assert.deepEqual(diff(new Map(), shots({ 2: 'b', 1: 'a' })), {
    total: 2,
    baseMissing: true,
    changes: [
      { slide: 1, kind: 'new' },
      { slide: 2, kind: 'new' },
    ],
  })
})

test('changes are sorted by slide number', () => {
  const { changes } = diff(shots({ 10: 'x', 2: 'x', 7: 'x' }), shots({ 10: 'y', 2: 'y', 7: 'y' }))
  assert.deepEqual(changes.map((c) => c.slide), [2, 7, 10])
})

test('the CLI writes a manifest and copies only the listed images', () => {
  const root = mkdtempSync(join(tmpdir(), 'slide-diff-'))
  const [base, head, out] = ['base', 'head', 'out'].map((d) => join(root, d))
  mkdirSync(base)
  mkdirSync(head)
  writeFileSync(join(base, '001.png'), 'same')
  writeFileSync(join(head, '001.png'), 'same')
  writeFileSync(join(base, '002.png'), 'old')
  writeFileSync(join(head, '002.png'), 'new')
  writeFileSync(join(head, '003.png'), 'added')
  writeFileSync(join(head, 'notes.txt'), 'ignored')

  const stdout = execFileSync('node', [SCRIPT, base, head, out], { encoding: 'utf8' })
  assert.match(stdout, /2 changed/)
  assert.deepEqual(JSON.parse(readFileSync(join(out, 'manifest.json'), 'utf8')), {
    total: 3,
    baseMissing: false,
    changes: [
      { slide: 2, kind: 'changed' },
      { slide: 3, kind: 'new' },
    ],
  })
  assert.deepEqual(readdirSync(out).sort(), ['002-after.png', '002-before.png', '003-after.png', 'manifest.json'])
  assert.equal(readFileSync(join(out, '002-before.png'), 'utf8'), 'old')
})

test('the CLI treats a missing base folder as baseMissing', () => {
  const root = mkdtempSync(join(tmpdir(), 'slide-diff-'))
  const head = join(root, 'head')
  mkdirSync(head)
  writeFileSync(join(head, '001.png'), 'a')
  execFileSync('node', [SCRIPT, join(root, 'nope'), head, join(root, 'out')])
  const m = JSON.parse(readFileSync(join(root, 'out', 'manifest.json'), 'utf8'))
  assert.equal(m.baseMissing, true)
  assert.deepEqual(m.changes, [{ slide: 1, kind: 'new' }])
})
