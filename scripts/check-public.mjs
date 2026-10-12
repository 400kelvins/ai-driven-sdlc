#!/usr/bin/env node
// Story 7 (spec 007, FR-007): before publishing, scan the history of `main` for author emails other
// than the GitHub noreply address, and for token-like secrets in any committed change.
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

export const ALLOWED_EMAIL = /^\d+\+400kelvins@users\.noreply\.github\.com$/
export const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{30,}/,
  /sk-(ant-)?[A-Za-z0-9_-]{30,}/,
  /AKIA[0-9A-Z]{16}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /vercel_[A-Za-z0-9]{24,}/,
]

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })

export function badEmails(log) {
  return [...new Set(log.split('\n').filter(Boolean))].filter((e) => !ALLOWED_EMAIL.test(e))
}

export function findSecrets(text) {
  return SECRET_PATTERNS.flatMap((re) => {
    const m = text.match(re)
    return m ? [`${re.source} → ${m[0].slice(0, 8)}…`] : []
  })
}

function main(ref = 'main') {
  const emails = badEmails(git('log', ref, '--format=%ae%n%ce'))
  const added = git('log', ref, '-p', '--no-color', '--format=', '--', '.', ':(exclude)package-lock.json')
    .split('\n')
    .filter((l) => l.startsWith('+'))
    .join('\n')
  const secrets = findSecrets(added)
  if (emails.length || secrets.length) {
    if (emails.length) console.error(`Non-noreply emails in ${ref} history: ${emails.join(', ')}`)
    if (secrets.length) console.error(`Possible secrets in ${ref} history:\n  ${secrets.join('\n  ')}`)
    return 1
  }
  console.log(`${ref} history is clean: noreply emails only, no token patterns`)
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv[2]))
