// Story 2.4: a review yes counts only with the reviewer's PR comment naming its scope and fingerprint.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { commentLine, hasCommentProof } from '../src/proof.mjs'
import { parseConfig } from '../src/scopes.mjs'
import { DECK_AND_PACKAGE, tempRepo, ug } from './helpers.mjs'

const PRESENTER = { login: 'Presenter', id: 7 }
const WITH_PROOF = { ...DECK_AND_PACKAGE, proof: 'comment', reviewers: [PRESENTER] }
const FILES = { 'slides.md': '# Talk', 'pages/a.md': '# A', 'packages/understand-gate/a.mjs': 'export {}' }
const c = (login, body, type = 'User', id = login.toLowerCase() === 'presenter' ? 7 : 99) => ({ id, login, type, body })

test('the comment line names the scope and the fingerprint', () => {
  assert.equal(commentLine('deck', '0123456789abcdef'), '/understand-gate yes deck 0123456789abcdef')
})

test('a listed reviewer comment with the exact line is proof', () => {
  const line = commentLine('deck', 'aaaa')
  assert.ok(hasCommentProof([c('Presenter', line)], [PRESENTER], 'deck', 'aaaa'))
  assert.ok(hasCommentProof([c('Presenter', `Reviewed it.\r\n${line}\nThanks`)], [PRESENTER], 'deck', 'aaaa'), 'a line inside a longer comment')
  assert.ok(hasCommentProof([c('Presenter', `  ${line}  `)], [PRESENTER], 'deck', 'aaaa'), 'surrounding spaces')
  assert.ok(hasCommentProof([c('presenter-renamed', line, 'User', 7)], [PRESENTER], 'deck', 'aaaa'), 'the same account after a rename')
})

test('a re-claimed login is not the reviewer: ids decide, not names', () => {
  const line = commentLine('deck', 'aaaa')
  assert.ok(!hasCommentProof([c('Presenter', line, 'User', 1234)], [PRESENTER], 'deck', 'aaaa'))
  assert.ok(!hasCommentProof([{ login: 'Presenter', type: 'User', body: line }], [PRESENTER], 'deck', 'aaaa'), 'no id')
})

test('anything else is not proof', () => {
  const line = commentLine('deck', 'aaaa')
  const reviewers = [PRESENTER]
  assert.ok(!hasCommentProof([], reviewers, 'deck', 'aaaa'), 'no comment')
  assert.ok(!hasCommentProof([c('Presenter', commentLine('deck', 'bbbb'))], reviewers, 'deck', 'aaaa'), 'other fingerprint')
  assert.ok(!hasCommentProof([c('Presenter', commentLine('package', 'aaaa'))], reviewers, 'deck', 'aaaa'), 'other scope')
  assert.ok(!hasCommentProof([c('someone', line)], reviewers, 'deck', 'aaaa'), 'unlisted login')
  assert.ok(!hasCommentProof([c('Presenter', line, 'Bot')], reviewers, 'deck', 'aaaa'), 'bot account')
  assert.ok(!hasCommentProof([c('Presenter', `I will say ${line} later`)], reviewers, 'deck', 'aaaa'), 'not a whole line')
  assert.ok(!hasCommentProof([c('Presenter', line.toUpperCase())], reviewers, 'deck', 'aaaa'), 'case-sensitive line')
})

test('config: comment proof needs a reviewer list; unknown modes are refused', () => {
  assert.equal(parseConfig(JSON.stringify(WITH_PROOF)).proof, 'comment')
  assert.throws(() => parseConfig(JSON.stringify({ ...WITH_PROOF, reviewers: [] })), /reviewers/)
  assert.throws(() => parseConfig(JSON.stringify({ ...WITH_PROOF, reviewers: ['Presenter'] })), /reviewers/)
  assert.throws(() => parseConfig(JSON.stringify({ ...WITH_PROOF, reviewers: [{ login: 'Presenter' }] })), /reviewers/)
  assert.throws(() => parseConfig(JSON.stringify({ ...WITH_PROOF, reviewers: [{ login: 'Presenter', id: '7' }] })), /reviewers/)
  assert.throws(() => parseConfig(JSON.stringify({ ...DECK_AND_PACKAGE, proof: 'vibes' })), /proof/)
})

/** main has the proof config; a feature branch changes the deck and records a review yes. */
function approvedBranch(config = WITH_PROOF) {
  const repo = tempRepo(FILES, config)
  repo.git('branch', '-M', 'main')
  repo.git('switch', '-q', '-c', 'feature')
  repo.write({ 'pages/a.md': '# A, edited' })
  repo.git('commit', '-qam', 'edit')
  ug(repo.dir, 'record', '--scope', 'deck', '--stage', 'review', '--story', '9', '--decision', 'yes')
  const fp = ug(repo.dir, 'fingerprint', '--scope', 'deck').stdout.trim()
  return { ...repo, fp }
}
const comments = (dir, list) => {
  const file = join(dir, '..', `${dir.split('/').pop()}-comments.ndjson`)
  writeFileSync(file, list.map((x) => JSON.stringify(x)).join('\n') + '\n')
  return file
}

test('check under comment proof: no comments file fails and says what to post', () => {
  const { dir, fp } = approvedBranch()
  const out = ug(dir, 'check', '--base', 'main')
  assert.equal(out.status, 1)
  assert.match(out.stderr, new RegExp(`deck: post on the pull request: /understand-gate yes deck ${fp}`))
})

test('check under comment proof: passes with the reviewer comment, fails without it', () => {
  const { dir, fp } = approvedBranch()
  assert.equal(ug(dir, 'check', '--base', 'main', '--comments', comments(dir, [c('someone', commentLine('deck', fp))])).status, 1)
  const out = ug(dir, 'check', '--base', 'main', '--comments', comments(dir, [c('presenter', commentLine('deck', fp))]))
  assert.equal(out.status, 0, out.stderr)
})

test('check under comment proof: a code change after the comment fails', () => {
  const repo = approvedBranch()
  const file = comments(repo.dir, [c('Presenter', commentLine('deck', repo.fp))])
  repo.write({ 'pages/a.md': '# A, edited again' })
  repo.git('commit', '-qam', 'again')
  assert.equal(ug(repo.dir, 'check', '--base', 'main', '--comments', file).status, 1)
})

test('proof settings come from main: a branch cannot switch proof off', () => {
  const repo = approvedBranch()
  repo.write({ '.understand-gate/config.json': JSON.stringify(DECK_AND_PACKAGE) })
  repo.git('commit', '-qam', 'drop proof')
  ug(repo.dir, 'record', '--scope', 'deck', '--stage', 'review', '--story', '9', '--decision', 'yes')
  const out = ug(repo.dir, 'check', '--base', 'main')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /post on the pull request/)
})

test('without a proof mode, no comments are needed', () => {
  const { dir } = approvedBranch(DECK_AND_PACKAGE)
  assert.equal(ug(dir, 'check', '--base', 'main').status, 0)
})

test('a malformed comments file fails in one line', () => {
  const { dir } = approvedBranch()
  const file = join(dir, '..', `${dir.split('/').pop()}-bad.ndjson`)
  writeFileSync(file, '{ nope\n')
  const out = ug(dir, 'check', '--base', 'main', '--comments', file)
  assert.equal(out.status, 1)
  assert.match(out.stderr, /comments/)
  assert.equal(out.stderr.trim().split('\n').length, 1)
})
