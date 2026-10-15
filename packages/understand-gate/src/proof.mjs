// Proof of a human yes (architecture AD-5), comment mode: the reviewer posts one line per scope on the PR.
// It shows the human's involvement on the pull request. It does not stop an agent that holds the
// reviewer's own GitHub login, which can post the same line.
import { readFileSync } from 'node:fs'

export const commentLine = (scope, fingerprint) => `/understand-gate yes ${scope} ${fingerprint}`

/**
 * `comments`: [{ id, login, type, body }] as fetched from the pull request; `reviewers`: [{ login, id }].
 * Matched by numeric user id: GitHub releases a renamed account's old login, so a name alone could be re-claimed.
 */
export function hasCommentProof(comments, reviewers, scope, fingerprint) {
  const allowed = new Set(reviewers.map((r) => r.id))
  const line = commentLine(scope, fingerprint)
  return comments.some(
    (c) =>
      c.type !== 'Bot' &&
      Number.isInteger(c.id) &&
      allowed.has(c.id) &&
      typeof c.body === 'string' &&
      c.body.split(/\r?\n/).some((l) => l.trim() === line),
  )
}

/** One JSON object per line: { id, login, type, body } (what CI's `gh api --jq ... | tojson` writes). */
export function readComments(file) {
  let text
  try {
    text = readFileSync(file, 'utf8')
  } catch (err) {
    throw new Error(`--comments ${file}: ${err.code === 'ENOENT' ? 'not found' : err.message}`)
  }
  return text
    .split('\n')
    .filter((l) => l.trim())
    .map((l, i) => {
      try {
        return JSON.parse(l)
      } catch {
        throw new Error(`--comments ${file} line ${i + 1}: not valid JSON`)
      }
    })
}
