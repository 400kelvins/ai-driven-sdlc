// The gate ledger (architecture AD-4): append-only JSON lines, one decision per scope.
// Only this module writes it. The latest line for a (scope, stage) decides. Fields are added, never renamed.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export const LEDGER = '.understand-gate/gates.jsonl'
export const STAGES = ['plan', 'implement', 'review']

export function readLedger(root) {
  const file = join(root, LEDGER)
  if (!existsSync(file)) return []
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((line, i) => [line, i + 1])
    .filter(([line]) => line.trim())
    .map(([line, n]) => {
      try {
        return JSON.parse(line)
      } catch {
        throw new Error(`${LEDGER} line ${n}: not valid JSON`)
      }
    })
}

/**
 * Checks the human's answer and builds one line per scope. `fingerprints` maps scope -> fingerprint.
 * Throws an Error with a one-line message on bad input.
 */
export function decisionLines({ stage, story, decision, attempts, firstTry, confidence, note }, fingerprints, now = new Date()) {
  if (!STAGES.includes(stage)) throw new Error(`--stage must be one of ${STAGES.join(', ')}`)
  if (!['yes', 'no'].includes(decision)) throw new Error('--decision must be yes or no')
  if (typeof story !== 'string' || !story) throw new Error('--story is required')
  const int = (value, name, min, max) => {
    if (value === undefined) return null
    const n = Number(value)
    if (!Number.isInteger(n) || n < min || n > max) throw new Error(`--${name} must be a whole number from ${min} to ${max}`)
    return n
  }
  const tries = int(attempts, 'attempts', 1, 1000)
  const sure = int(confidence, 'confidence', 1, 5)
  if (firstTry !== undefined && !['yes', 'no'].includes(firstTry)) throw new Error('--first-try must be yes or no')
  return Object.entries(fingerprints).map(([scope, fingerprint]) => ({
    ts: now.toISOString(),
    scope,
    stage,
    story,
    decision,
    fingerprint,
    proof: null,
    attempts: tries,
    firstTry: firstTry === undefined ? null : firstTry === 'yes',
    confidence: sure,
    note: typeof note === 'string' ? note : null,
  }))
}

export function appendLines(root, lines) {
  const file = join(root, LEDGER)
  mkdirSync(dirname(file), { recursive: true })
  appendFileSync(file, lines.map((l) => JSON.stringify(l) + '\n').join(''))
}

/** The latest review line for each scope must be yes and match its current fingerprint. */
export function approval(entries, scope, fingerprint) {
  const latest = entries.filter((e) => e.scope === scope && e.stage === 'review').at(-1)
  if (!latest) return { ok: false, reason: `${scope}: no review decision` }
  if (latest.decision !== 'yes') return { ok: false, reason: `${scope}: latest review decision (story ${latest.story}) was "${latest.decision}"` }
  if (latest.fingerprint !== fingerprint) {
    return { ok: false, reason: `${scope}: code changed since the review yes (approved ${latest.fingerprint}, now ${fingerprint})` }
  }
  return { ok: true, entry: latest }
}
