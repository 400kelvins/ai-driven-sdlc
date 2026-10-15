import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { approved, dirtyShipped, fingerprint, isCode, parseArgs } from '../../scripts/gate.mjs'

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
  for (const p of ['slides.md', 'pages/talk.md', 'scripts/gate.mjs', 'components/Flow.vue', 'package.json', '.github/workflows/ci.yml', '.specify/extensions.yml']) {
    assert.equal(isCode(p), true, p)
  }
  for (const p of ['_bmad-output/x/gates.jsonl', '.understand-gate/gates.jsonl', 'specs/001/spec.md', '.specify/memory/constitution.md', 'README.md', 'public/demo/README.md']) {
    assert.equal(isCode(p), false, p)
  }
})

// Moves into temp repos and restores the working directory
test('a clean clone fingerprints like the original; dirty shipped files are reported', () => {
  const run = (dir, ...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' })
  const src = mkdtempSync(join(tmpdir(), 'gate-src-'))
  run(src, 'init', '-q', '-b', 'main')
  writeFileSync(join(src, 'a.js'), 'x\n')
  writeFileSync(join(src, 'notes.md'), 'n\n')
  run(src, 'add', '.')
  run(src, '-c', 'user.email=t@example.invalid', '-c', 'user.name=t', 'commit', '-q', '-m', 'a')
  const clone = join(mkdtempSync(join(tmpdir(), 'gate-clone-')), 'c')
  execFileSync('git', ['clone', '-q', '--depth', '1', `file://${src}`, clone])

  const home = process.cwd()
  try {
    process.chdir(src)
    const original = fingerprint()
    assert.deepEqual(dirtyShipped(), [])
    writeFileSync('notes.md', 'docs change\n')
    assert.deepEqual(dirtyShipped(), [])
    writeFileSync('b.js', 'new\n')
    assert.deepEqual(dirtyShipped(), ['b.js'])

    process.chdir(clone)
    assert.equal(fingerprint(), original)
  } finally {
    process.chdir(home)
  }
})
