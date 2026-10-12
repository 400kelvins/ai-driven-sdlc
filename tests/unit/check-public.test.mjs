import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { badEmails, findSecrets, scan, trailerEmails } from '../../scripts/check-public.mjs'

const NOREPLY = '190785603+400kelvins@users.noreply.github.com'
// Fake secrets are built at runtime so this file never contains a literal one
const fakeGhToken = () => 'ghp_' + 'a'.repeat(36)
const fakeKeyHeader = () => '-'.repeat(5) + 'BEGIN OPENSSH PRIVATE' + ' KEY' + '-'.repeat(5)

test('only allowed noreply addresses pass', () => {
  assert.deepEqual(badEmails(`${NOREPLY}\nnoreply@anthropic.com\n`), [])
  assert.deepEqual(badEmails(`${NOREPLY}\nsomeone@gmail.com\n`), ['someone@gmail.com'])
})

test('trailer emails are extracted', () => {
  assert.equal(trailerEmails('feat: x\n\nCo-Authored-By: Someone <someone@gmail.com>\n'), 'someone@gmail.com')
})

test('token patterns are caught', () => {
  assert.equal(findSecrets('+const t = "' + fakeGhToken() + '"').length, 1)
  assert.equal(findSecrets('+' + fakeKeyHeader()).length, 1)
  assert.equal(findSecrets('+AIza' + 'b'.repeat(35)).length, 1)
  assert.equal(findSecrets('+npm_' + 'c'.repeat(36)).length, 1)
  assert.equal(findSecrets('+password = "' + 'd'.repeat(20) + '"').length, 1)
  assert.deepEqual(findSecrets('+const tokens = 250000'), [])
})

function tempRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'check-public-'))
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' })
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', NOREPLY)
  git('config', 'user.name', '400kelvins')
  const commit = (file, content, message, env = {}) => {
    writeFileSync(join(dir, file), content)
    git('add', file)
    execFileSync('git', ['commit', '-q', '-m', message], { cwd: dir, env: { ...process.env, ...env } })
  }
  return { dir, git, commit }
}

test('integration: clean main passes', () => {
  const { dir, commit } = tempRepo()
  commit('a.txt', 'hello\n', 'feat: a\n\nCo-Authored-By: Claude <noreply@anthropic.com>')
  assert.deepEqual(scan(dir, 'main'), { emails: [], secrets: [] })
})

test('integration: personal author email fails', () => {
  const { dir, commit } = tempRepo()
  commit('a.txt', 'hello\n', 'feat: a', { GIT_AUTHOR_EMAIL: 'me@gmail.com' })
  assert.deepEqual(scan(dir, 'main').emails, ['me@gmail.com'])
})

test('integration: secret in a commit message fails', () => {
  const { dir, commit } = tempRepo()
  commit('a.txt', 'hello\n', 'fix: rotate ' + fakeGhToken())
  assert.equal(scan(dir, 'main').secrets.length, 1)
})

test('integration: problems on another branch show with --all, not with main', () => {
  const { dir, git, commit } = tempRepo()
  commit('a.txt', 'hello\n', 'feat: a')
  git('checkout', '-q', '-b', 'backup')
  commit('b.txt', 'x\n', 'wip', { GIT_AUTHOR_EMAIL: 'me@gmail.com' })
  git('checkout', '-q', 'main')
  assert.deepEqual(scan(dir, 'main').emails, [])
  assert.deepEqual(scan(dir, '--all').emails, ['me@gmail.com'])
})
