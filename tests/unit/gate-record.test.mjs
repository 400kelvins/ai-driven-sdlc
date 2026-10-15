// npm run gate:record writes the old ledger and the understand-gate ledger (spec 013).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LEDGER as OLD_LEDGER } from '../../scripts/gate.mjs'

const BIN = fileURLToPath(new URL('../../scripts/gate-record.mjs', import.meta.url))
const NEW_LEDGER = '.understand-gate/gates.jsonl'
const CONFIG = {
  scopes: {
    deck: { include: ['**'], exclude: ['packages/**', 'specs/**', '_bmad-output/**', '.understand-gate/**', '**/*.md', '!slides.md', '!.understand-gate/config.json'] },
    package: { include: ['packages/understand-gate/**'] },
  },
}

function repo(changes) {
  const dir = mkdtempSync(join(tmpdir(), 'gate-record-'))
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' })
  const write = (files) => {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true })
      writeFileSync(join(dir, path), content)
    }
  }
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'test@example.invalid')
  git('config', 'user.name', 'test')
  git('config', 'commit.gpgsign', 'false')
  write({ 'slides.md': '# Talk', 'packages/understand-gate/a.mjs': 'export {}', 'specs/s.md': '# S', '.understand-gate/config.json': JSON.stringify(CONFIG) })
  git('add', '-A')
  git('commit', '-qm', 'init')
  git('switch', '-q', '-c', 'feature')
  write(changes)
  git('add', '-A')
  git('commit', '-qm', 'change')
  return dir
}

const record = (dir, ...args) =>
  spawnSync(process.execPath, [BIN, '--stage', 'review', '--story', '5', '--decision', 'yes', ...args], {
    cwd: dir,
    encoding: 'utf8',
    env: { ...process.env, UG_BASE: 'main' },
  })
const lines = (dir, file) => readFileSync(join(dir, file), 'utf8').trim().split('\n').map((l) => JSON.parse(l))

test('one old line, and one understand-gate line per touched scope', () => {
  const dir = repo({ 'slides.md': '# edited', 'packages/understand-gate/a.mjs': 'export const x = 1' })
  const out = record(dir, '--note', 'both', '--first-try', 'no', '--attempts', '2')
  assert.equal(out.status, 0, out.stderr)
  assert.equal(lines(dir, OLD_LEDGER).length, 1)
  const ug = lines(dir, NEW_LEDGER)
  assert.deepEqual(ug.map((l) => l.scope), ['deck', 'package'])
  assert.ok(ug.every((l) => l.stage === 'review' && l.story === '5' && l.note === 'both' && l.firstTry === false && l.attempts === 2))
})

test('a docs-only branch writes only the old ledger', () => {
  const dir = repo({ 'specs/s.md': '# edited' })
  const out = record(dir)
  assert.equal(out.status, 0, out.stderr)
  assert.equal(lines(dir, OLD_LEDGER).length, 1)
  assert.ok(!existsSync(join(dir, NEW_LEDGER)))
  assert.match(out.stdout, /no scope touched/)
})

test('a bad answer writes neither ledger', () => {
  const dir = repo({ 'slides.md': '# edited' })
  const out = spawnSync(process.execPath, [BIN, '--stage', 'ship', '--story', '5', '--decision', 'yes'], {
    cwd: dir,
    encoding: 'utf8',
    env: { ...process.env, UG_BASE: 'main' },
  })
  assert.notEqual(out.status, 0)
  assert.ok(!existsSync(join(dir, OLD_LEDGER)))
  assert.ok(!existsSync(join(dir, NEW_LEDGER)))
})
