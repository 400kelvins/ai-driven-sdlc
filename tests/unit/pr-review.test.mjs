import { test } from 'node:test'
import assert from 'node:assert/strict'
import { latestReview, render } from '../../scripts/pr-review.mjs'

const c = (body, createdAt) => ({ body, createdAt })

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

test('render demotes the heading and links the PR', () => {
  const out = render({ number: 2, url: 'https://github.com/o/r/pull/2', comments: [c('## AI code review\n\n🔴 bug', '2026-10-14T10:00:00Z')] })
  assert.equal(out, '**PR**: #2 https://github.com/o/r/pull/2\n\n### AI code review\n\n🔴 bug\n')
})

test('render says when there is no review yet', () => {
  const out = render({ number: 2, url: 'https://github.com/o/r/pull/2', comments: [] })
  assert.equal(out, '**PR**: #2 https://github.com/o/r/pull/2\n\n_No AI review comment yet._\n')
})
