#!/usr/bin/env node
// understand-gate: no yes without understanding.
//
//   understand-gate fingerprint --scope <name>
//   understand-gate record --scope <a,b> --stage plan|implement|review --story <id> --decision yes|no
//                          [--attempts <n>] [--first-try yes|no] [--confidence 1-5] [--note "<text>"] [--dry-run]
//   understand-gate check --base <ref> | --all
//   understand-gate touched --base <ref>       # touched scope names, one per line
//   understand-gate stats
//
// Exit codes: 0 pass, 1 failure, 2 usage. Errors are one line on stderr.
import { parseArgs } from '../src/args.mjs'
import { fingerprint } from '../src/fingerprint.mjs'
import { changedSince, git, isShallow, repoRoot, showAt } from '../src/git.mjs'
import { LEDGER, appendLines, approval, assertAppendOnly, decisionLines, readLedger } from '../src/ledger.mjs'
import { CONFIG, inScope, loadConfig, parseConfig } from '../src/scopes.mjs'
import { formatStats, stats } from '../src/stats.mjs'

const USAGE =
  'Usage: understand-gate fingerprint --scope <name> | record --scope <a,b> --stage <s> --story <id> --decision yes|no | check --base <ref> | check --all | touched --base <ref> | stats'

class Usage extends Error {}

function pickScopes(scopes, names) {
  for (const name of names) {
    if (!Object.hasOwn(scopes, name)) throw new Error(`Unknown scope "${name}"; known scopes: ${Object.keys(scopes).join(', ')}`)
  }
  return names
}

/**
 * Scopes a branch touched since it left `baseRef`, judged by the config at the merge base.
 * A branch must not judge itself: scopes and earlier decisions come from where it started (AD-2, AD-4).
 */
function touchedSince(root, baseRef) {
  // A shallow clone can hide the real merge base, and with it the files a branch changed
  if (isShallow(root)) throw new Error('shallow clone: fetch full history (actions/checkout fetch-depth: 0) before using --base')
  const base = git(root, 'merge-base', baseRef, 'HEAD').trim()
  const baseConfig = showAt(root, base, CONFIG)
  // Without a config at the base, the branch would choose its own scopes; refuse instead
  if (baseConfig === null) throw new Error(`${CONFIG} not found at the merge base with ${baseRef}; merge the config first`)
  const scopes = parseConfig(baseConfig, `${CONFIG} at ${baseRef}`).scopes
  assertAppendOnly(root, showAt(root, base, LEDGER))
  const changed = changedSince(root, base)
  return { scopes, names: Object.keys(scopes).filter((n) => changed.some((path) => inScope(path, scopes[n]))) }
}

const COMMANDS = {
  fingerprint(root, { scopes }, args) {
    if (typeof args.scope !== 'string') throw new Usage()
    const [name] = pickScopes(scopes, [args.scope])
    console.log(fingerprint(scopes[name], { cwd: root }))
  },

  record(root, { scopes }, args) {
    for (const flag of ['scope', 'stage', 'story', 'decision', 'attempts', 'first-try', 'confidence', 'note']) {
      if (args[flag] === true) throw new Error(`--${flag} needs a value`)
    }
    const names = pickScopes(scopes, String(args.scope ?? '').split(',').filter(Boolean))
    if (!names.length) throw new Error('--scope is required')
    // Validate the answer before touching git, so bad input fails fast and alone
    const answer = { ...args, firstTry: args['first-try'], story: typeof args.story === 'string' ? args.story : undefined }
    decisionLines(answer, {})
    const dirty = changedSince(root, 'HEAD').filter((path) => names.some((n) => inScope(path, scopes[n])))
    if (dirty.length) throw new Error(`Commit these files before recording, so CI sees the same code: ${dirty.join(', ')}`)
    const fingerprints = Object.fromEntries(names.map((n) => [n, fingerprint(scopes[n], { cwd: root })]))
    const lines = decisionLines(answer, fingerprints)
    if (args['dry-run'] === true) return
    appendLines(root, lines)
    for (const l of lines) console.log(`Recorded ${l.stage} ${l.decision} for ${l.scope}, story ${l.story} (${l.fingerprint})`)
  },

  touched(root, config, args) {
    if (typeof args.base !== 'string') throw new Usage()
    const { names } = touchedSince(root, args.base)
    if (names.length) console.log(names.join('\n'))
  },

  check(root, config, args) {
    const all = args.all === true && args.base === undefined
    if (!all && (typeof args.base !== 'string' || args.all !== undefined)) throw new Usage()
    let { scopes } = config
    let names = Object.keys(scopes)
    if (!all) {
      ;({ scopes, names } = touchedSince(root, args.base))
      if (!names.length) {
        console.log(`Human review gate passed: no scope touched since ${args.base}`)
        return
      }
    }
    const ledger = readLedger(root)
    const results = names.map((n) => approval(ledger, n, fingerprint(scopes[n], { cwd: root })))
    const failed = results.filter((r) => !r.ok)
    if (failed.length) throw new Error(`Human review gate not passed: ${failed.map((r) => r.reason).join('; ')}`)
    console.log(`Human review gate passed: ${results.map((r) => `${r.entry.scope} (story ${r.entry.story})`).join(', ')}`)
  },

  stats(root) {
    console.log(formatStats(stats(readLedger(root))))
  },
}

function main([cmd, ...rest]) {
  if (!Object.hasOwn(COMMANDS, cmd ?? '')) {
    console.error(USAGE)
    return 2
  }
  try {
    const root = repoRoot()
    COMMANDS[cmd](root, loadConfig(root), parseArgs(rest))
    return 0
  } catch (err) {
    if (err instanceof Usage) {
      console.error(USAGE)
      return 2
    }
    // git puts its reason ("fatal: not a git repository") on stderr, not in the message
    const reason = String(err.stderr || '').trim() || err.message
    console.error(reason.split('\n')[0])
    return 1
  }
}

process.exitCode = main(process.argv.slice(2))
