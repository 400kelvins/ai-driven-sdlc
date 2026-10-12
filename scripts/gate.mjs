#!/usr/bin/env node
// Human gate ledger. A human decision is recorded with a fingerprint of the code it covers;
// `check` lets a deploy through only if the current code was approved at the review gate.
//
//   node scripts/gate.mjs record --stage plan|implement|review --story <id> --decision yes|no [--note "..."]
//   node scripts/gate.mjs check [--stage review]
//   node scripts/gate.mjs fingerprint
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

export const LEDGER = '_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/gates.jsonl'
export const STAGES = ['plan', 'implement', 'review']
// Docs and gate artifacts change after a decision; they are not the code being approved.
const isCode = (path) => !/^(_bmad-output|specs)\//.test(path) && !path.endsWith('.md')
const EXCLUDE = [':(exclude)_bmad-output', ':(exclude)specs', ':(exclude,glob)**/*.md']

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' })

/** Hash of every tracked code file in HEAD plus any uncommitted code changes. */
export function fingerprint() {
  const tree = git('ls-tree', '-r', 'HEAD')
    .split('\n')
    .filter((line) => line && isCode(line.split('\t')[1]))
    .join('\n')
  const dirty = git('diff', 'HEAD', '--', '.', ...EXCLUDE)
  const hash = createHash('sha256').update(tree).update(dirty)
  // New files not yet committed count as code changes too
  for (const path of git('ls-files', '--others', '--exclude-standard').split('\n').filter((p) => p && isCode(p))) {
    hash.update(path).update(readFileSync(path))
  }
  return hash.digest('hex').slice(0, 16)
}

export function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[i + 1]?.startsWith('--') ? true : argv[++i]
  }
  return out
}

export function readLedger(file = LEDGER) {
  if (!existsSync(file)) return []
  return readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
}

/** The latest decision for a stage decides; it must be yes and cover this fingerprint. */
export function approved(entries, stage, fp) {
  const latest = entries.filter((e) => e.stage === stage).at(-1)
  if (!latest) return { ok: false, reason: `no ${stage} gate decision recorded` }
  if (latest.decision !== 'yes') return { ok: false, reason: `latest ${stage} gate (story ${latest.story}) was "${latest.decision}"` }
  if (latest.fingerprint !== fp) {
    return { ok: false, reason: `code changed since the ${stage} gate was approved (approved ${latest.fingerprint}, now ${fp})` }
  }
  return { ok: true, entry: latest }
}

function main(argv) {
  const [cmd, ...rest] = argv
  const args = parseArgs(rest)
  if (cmd === 'fingerprint') {
    console.log(fingerprint())
    return 0
  }
  if (cmd === 'record') {
    if (!STAGES.includes(args.stage)) return fail(`--stage must be one of ${STAGES.join(', ')}`)
    if (!['yes', 'no'].includes(args.decision)) return fail('--decision must be yes or no')
    if (!args.story) return fail('--story is required')
    const entry = {
      at: new Date().toISOString(),
      stage: args.stage,
      story: String(args.story),
      decision: args.decision,
      fingerprint: fingerprint(),
      commit: git('rev-parse', '--short', 'HEAD').trim(),
      ...(args.note ? { note: String(args.note) } : {}),
    }
    mkdirSync(dirname(LEDGER), { recursive: true })
    appendFileSync(LEDGER, JSON.stringify(entry) + '\n')
    console.log(`Recorded ${entry.stage} gate for story ${entry.story}: ${entry.decision} (${entry.fingerprint})`)
    return 0
  }
  if (cmd === 'check') {
    const stage = args.stage ?? 'review'
    const result = approved(readLedger(), stage, fingerprint())
    if (!result.ok) return fail(`Human gate not passed: ${result.reason}.\nRun the ${stage} gate (/speckit-gate ${stage}) and answer yes before shipping.`)
    console.log(`Human ${stage} gate passed: story ${result.entry.story}, approved ${result.entry.at}`)
    return 0
  }
  return fail('Usage: gate.mjs record|check|fingerprint')
}

function fail(message) {
  console.error(message)
  return 1
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv.slice(2)))
