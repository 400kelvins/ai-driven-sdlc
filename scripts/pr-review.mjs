#!/usr/bin/env node
// Prints the pull request's AI code review and slide changes as Markdown for the review-gate Gate Review Pack.
//
//   node scripts/pr-review.mjs [<pr-number>]    # default: the open PR for the current branch
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

export const MARKER = '## AI code review'
export const SLIDES_MARKER = '## Slide changes'
// The workflows post as the Actions bot; anyone else's comment with a marker is ignored
export const REVIEWERS = ['github-actions', 'github-actions[bot]']

/** Body of the newest comment by the Actions bot that starts with this marker, or null. */
export function latestComment(comments, marker) {
  const marked = comments.filter((c) => REVIEWERS.includes(c.author?.login) && c.body.startsWith(marker))
  marked.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return marked.at(-1)?.body.trim() ?? null
}

export const latestReview = (comments) => latestComment(comments, MARKER)

export function render({ number, url, comments }) {
  const demote = (body) => body.replace(/^## /, '### ')
  const review = latestComment(comments, MARKER)
  const slides = latestComment(comments, SLIDES_MARKER)
  return [
    `**PR**: #${number} ${url}`,
    review ? demote(review) : '_No AI review comment yet._',
    slides ? demote(slides) : '_No slide changes comment yet._',
  ].join('\n\n') + '\n'
}

function main(argv) {
  let pr
  try {
    const out = execFileSync('gh', ['pr', 'view', ...argv.slice(0, 1), '--json', 'number,url,comments'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    pr = JSON.parse(out)
  } catch (err) {
    const stderr = String(err.stderr ?? err.message)
    if (/no pull requests found/i.test(stderr)) {
      console.log('_No pull request for this branch._')
      return 0
    }
    console.error(stderr.trim())
    return 1
  }
  process.stdout.write(render(pr))
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv.slice(2)))
