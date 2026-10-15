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
  const touched = run(UG, ['touched', '--base', process.env.UG_BASE || 'origin/main'], true)
  if (touched.status !== 0) return touched.status ?? 1
  const scopes = touched.stdout.split('\n').filter(Boolean)

  const old = run(OLD, ['record', ...argv])
  if (old.status !== 0) return old.status ?? 1

  if (!scopes.length) {
    console.log('understand-gate: no scope touched, nothing to record')
    return 0
  }
  const forwarded = []
  for (let i = 0; i < argv.length; i++) {
    if (PASS.includes(argv[i].replace(/^--/, '')) && argv[i + 1] !== undefined) forwarded.push(argv[i], argv[++i])
  }
  return run(UG, ['record', '--scope', scopes.join(','), ...forwarded]).status ?? 1
}

process.exitCode = main(process.argv.slice(2))
