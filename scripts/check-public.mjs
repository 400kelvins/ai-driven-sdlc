#!/usr/bin/env node
// Story 7 (spec 007, FR-007): before publishing, scan history for author/committer/trailer emails
// other than allowed noreply addresses, and for token-like secrets in changes and commit messages.
//   node scripts/check-public.mjs [ref]      # default: main (the ref we publish)
//   node scripts/check-public.mjs --all      # every local ref, incl. backups (should never be pushed)
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

export const ALLOWED_EMAILS = [
  /^\d+\+400kelvins@users\.noreply\.github\.com$/,
  /^noreply@anthropic\.com$/, // Co-Authored-By trailer for Claude
]
export const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{30,}/,
  /sk-(ant-)?[A-Za-z0-9_-]{30,}/,
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z_-]{35}/,
  /npm_[A-Za-z0-9]{36}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /(secret|token|password|api[_-]?key)\s*[:=]\s*['"][^'"\s]{16,}['"]/i,
]

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })

export function badEmails(text) {
  return [...new Set(text.split('\n').map((l) => l.trim()).filter(Boolean))]
    .filter((e) => !ALLOWED_EMAILS.some((re) => re.test(e)))
}

export function trailerEmails(messages) {
  return [...messages.matchAll(/^[\w-]+-by:.*<([^>]+)>/gim)].map((m) => m[1]).join('\n')
}

export function findSecrets(text) {
  return SECRET_PATTERNS.flatMap((re) => {
    const m = text.match(re)
    return m ? [`${re.source} → ${m[0].slice(0, 8)}…`] : []
  })
}

export function scan(cwd = '.', ref = 'main') {
  const refs = ref === '--all' ? ['--all'] : [ref]
  const messages = git(cwd, 'log', ...refs, '--format=%B')
  const emails = badEmails(git(cwd, 'log', ...refs, '--format=%ae%n%ce') + '\n' + trailerEmails(messages))
  const added = git(cwd, 'log', ...refs, '-p', '--no-color', '--format=')
    .split('\n')
    .filter((l) => l.startsWith('+'))
    .join('\n')
  return { emails, secrets: findSecrets(added + '\n' + messages) }
}

function main(ref = 'main') {
  const { emails, secrets } = scan('.', ref)
  const label = ref === '--all' ? 'all local refs' : ref
  if (emails.length || secrets.length) {
    if (emails.length) console.error(`Disallowed emails in ${label}: ${emails.join(', ')}`)
    if (secrets.length) console.error(`Possible secrets in ${label}:\n  ${secrets.join('\n  ')}`)
    return 1
  }
  console.log(`${label}: allowed emails only, no token patterns (changes and commit messages)`)
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv[2]))
