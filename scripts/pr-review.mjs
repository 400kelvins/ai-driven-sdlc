#!/usr/bin/env node
// Prints the pull request's AI code review as Markdown for the review-gate Gate Review Pack.
//
//   node scripts/pr-review.mjs [<pr-number>]    # default: the open PR for the current branch
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

export const MARKER = '## AI code review'

/** Body of the newest comment that starts with the marker, or null. */
export function latestReview(comments) {
  const marked = comments.filter((c) => c.body.trimStart().startsWith(MARKER))
  marked.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return marked.at(-1)?.body.trim() ?? null
}

export function render({ number, url, comments }) {
  const review = latestReview(comments)
  const body = review ? review.replace(/^## /, '### ') : '_No AI review comment yet._'
  return `**PR**: #${number} ${url}\n\n${body}\n`
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
