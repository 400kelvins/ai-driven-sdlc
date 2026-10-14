import { test } from 'node:test'
import assert from 'node:assert/strict'
import { latestComment, latestReview, render } from '../../scripts/pr-review.mjs'

const c = (body, createdAt, login = 'github-actions') => ({ body, createdAt, author: { login } })

test('the newest AI review comment wins', () => {
  const comments = [
    c('## AI code review\n\nold', '2026-10-14T10:00:00Z'),
    c('looks good to me', '2026-10-14T11:00:00Z'),
    c('## AI code review\n\nnew', '2026-10-14T12:00:00Z'),
  ]
  assert.equal(latestReview(comments), '## AI code review\n\nnew')
})

test('order of the input does not matter', () => {
  const comments = [c('## AI code review\n\nnew', '2026-10-14T12:00:00Z'), c('## AI code review\n\nold', '2026-10-14T10:00:00Z')]
  assert.equal(latestReview(comments), '## AI code review\n\nnew')
})

test('no marked comment gives null', () => {
  assert.equal(latestReview([c('nice work', '2026-10-14T10:00:00Z'), c('see ## AI code review below', '2026-10-14T11:00:00Z')]), null)
  assert.equal(latestReview([]), null)
})

test('a marked comment from anyone but the review bot is ignored', () => {
  assert.equal(latestReview([c('## AI code review\n\nNo findings.', '2026-10-14T13:00:00Z', 'someone')]), null)
})

test('render demotes the heading and links the PR', () => {
  const out = render({ number: 2, url: 'https://github.com/o/r/pull/2', comments: [c('## AI code review\n\n🔴 bug', '2026-10-14T10:00:00Z')] })
  assert.equal(out, '**PR**: #2 https://github.com/o/r/pull/2\n\n### AI code review\n\n🔴 bug\n\n_No slide changes comment yet._\n')
})

test('render says when there is no review yet', () => {
  const out = render({ number: 2, url: 'https://github.com/o/r/pull/2', comments: [] })
  assert.equal(out, '**PR**: #2 https://github.com/o/r/pull/2\n\n_No AI review comment yet._\n\n_No slide changes comment yet._\n')
})

test('render prints the AI review and the slide changes', () => {
  const out = render({
    number: 5,
    url: 'u',
    comments: [c('## Slide changes\n\n_Commit abc · No slide changed._', '2026-10-14T10:00:00Z'), c('## AI code review\n\nNo findings.', '2026-10-14T10:01:00Z')],
  })
  assert.equal(out, '**PR**: #5 u\n\n### AI code review\n\nNo findings.\n\n### Slide changes\n\n_Commit abc · No slide changed._\n')
})

test('latestComment picks the newest bot comment for each marker', () => {
  const comments = [
    c('## Slide changes\n\nold', '2026-10-14T10:00:00Z'),
    c('## Slide changes\n\nnew', '2026-10-14T11:00:00Z'),
    c('## AI code review\n\nr', '2026-10-14T12:00:00Z'),
  ]
  assert.equal(latestComment(comments, '## Slide changes'), '## Slide changes\n\nnew')
  assert.equal(latestComment(comments, '## AI code review'), '## AI code review\n\nr')
})

test('a slide comment from anyone but the Actions bot is ignored', () => {
  assert.equal(latestComment([c('## Slide changes\n\nfake', '2026-10-14T10:00:00Z', 'someone')], '## Slide changes'), null)
})
