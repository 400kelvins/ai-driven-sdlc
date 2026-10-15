#!/usr/bin/env node
// `npm run gate:record` (spec 013): records a gate decision in both ledgers until Story 2.6 retires the old one.
//   1. the old whole-repo ledger (scripts/gate.mjs), which `human-gate` and `npm run ship` check;
//   2. the understand-gate ledger, one line per scope the branch touched, which `understand-gate` checks.
// The base branch is origin/main; UG_BASE overrides it (tests).
//
//   node scripts/gate-record.mjs --stage plan|implement|review --story <id> --decision yes|no [--note "..."]
//                                [--attempts <n>] [--first-try yes|no] [--confidence 1-5]
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const OLD = fileURLToPath(new URL('./gate.mjs', import.meta.url))
const UG = fileURLToPath(new URL('../packages/understand-gate/bin/understand-gate.mjs', import.meta.url))
const PASS = ['stage', 'story', 'decision', 'note', 'attempts', 'first-try', 'confidence']

const run = (bin, args, capture = false) =>
  spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit' })

function main(argv) {
  // Which scopes first, so a failure stops before either ledger is written
  const base = process.env.UG_BASE || 'origin/main'
  const touched = run(UG, ['touched', '--base', base], true)
  if (touched.status !== 0) return touched.status ?? 1
  const scopes = touched.stdout.split('\n').filter(Boolean)

  const forwarded = []
  for (let i = 0; i < argv.length; i++) {
    if (PASS.includes(argv[i].replace(/^--/, '')) && argv[i + 1] !== undefined) forwarded.push(argv[i], argv[++i])
  }
  // Fingerprint with main's config, exactly as the understand-gate check will
  const ug = (...more) => run(UG, ['record', '--base', base, '--scope', scopes.join(','), ...forwarded, ...more]).status ?? 1

  // Check the understand-gate answer before writing anything, so a refusal leaves no half-written record
  if (scopes.length && ug('--dry-run') !== 0) return 1

  const old = run(OLD, ['record', ...argv])
  if (old.status !== 0) return old.status ?? 1

  if (!scopes.length) {
    console.log('understand-gate: no scope touched, nothing to record')
    return 0
  }
  const status = ug()
  const asked = (flag) => argv[argv.indexOf(`--${flag}`) + 1]
  if (status !== 0 || asked('stage') !== 'review' || asked('decision') !== 'yes') return status

  // The reviewer's proof (spec 014): one line per scope, posted on the pull request from their account
  const lines = scopes.map((scope) => {
    const fp = run(UG, ['fingerprint', '--base', base, '--scope', scope], true).stdout.trim()
    return `/understand-gate yes ${scope} ${fp}`
  })
  console.log(`\nPaste on the pull request, from your own account:\n\n${lines.join('\n')}\n`)
  return 0
}

process.exitCode = main(process.argv.slice(2))
