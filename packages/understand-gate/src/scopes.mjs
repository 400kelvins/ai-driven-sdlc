// Scopes: named sets of files, each approved and fingerprinted on its own (architecture AD-3).
// Patterns are gitignore-style and match the whole repo-relative path:
//   *  any characters except /      **  any characters, / included
//   an exclude starting with ! re-includes; the last matching exclude wins.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { LEDGER } from './ledger.mjs'

export const CONFIG = '.understand-gate/config.json'

const cache = new Map()

function toRegExp(pattern) {
  let out = ''
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i]
    if (c === '*' && pattern[i + 1] === '*') {
      if (pattern[i + 2] === '/') {
        out += '(?:.*/)?'
        i += 2
      } else {
        out += '.*'
        i += 1
      }
    } else if (c === '*') out += '[^/]*'
    else if (c === '?') out += '[^/]'
    else out += c.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  }
  // s: `.` also matches newlines, so ** covers every file name git can hold
  return new RegExp(`^${out}$`, 's')
}

export function matches(pattern, path) {
  if (!cache.has(pattern)) cache.set(pattern, toRegExp(pattern))
  return cache.get(pattern).test(path)
}

export function inScope(path, scope) {
  // The ledger records decisions about scopes, so it can never be part of one (AD-3)
  if (path === LEDGER) return false
  if (!scope.include.some((p) => matches(p, path))) return false
  let excluded = false
  for (const p of scope.exclude ?? []) {
    if (p.startsWith('!')) {
      if (matches(p.slice(1), path)) excluded = false
    } else if (matches(p, path)) excluded = true
  }
  return !excluded
}

// Unsupported gitignore forms would silently match nothing, leaving a scope that never changes.
function patternProblem(pattern) {
  if (typeof pattern !== 'string' || !pattern.replace(/^!/, '')) return 'must be a non-empty string'
  const body = pattern.replace(/^!/, '')
  if (body.startsWith('/')) return 'must not start with /; patterns are already relative to the repo root'
  if (body.endsWith('/')) return 'must not end with /; use dir/** for a folder'
  if (/[[\]]/.test(body)) return 'uses [ ], which is not supported'
  return ''
}

/** Reads and checks the config; throws an Error with a one-line message. */
export function loadConfig(cwd = process.cwd()) {
  let text
  try {
    text = readFileSync(join(cwd, CONFIG), 'utf8')
  } catch (err) {
    throw new Error(`${CONFIG}: ${err.code === 'ENOENT' ? 'not found' : err.message}`)
  }
  return parseConfig(text)
}

/** Checks config text, from the working tree or from another commit. */
export function parseConfig(text, where = CONFIG) {
  let config
  try {
    config = JSON.parse(text)
  } catch {
    throw new Error(`${where}: not valid JSON`)
  }
  const scopes = config?.scopes
  if (!scopes || typeof scopes !== 'object' || !Object.keys(scopes).length) {
    throw new Error(`${where}: needs at least one scope under "scopes"`)
  }
  for (const [name, scope] of Object.entries(scopes)) {
    const valid = Array.isArray(scope?.include) && (scope.exclude === undefined || Array.isArray(scope.exclude))
    if (!valid) throw new Error(`${where}: scope "${name}" needs an "include" list and an optional "exclude" list`)
    for (const pattern of [...scope.include, ...(scope.exclude ?? [])]) {
      const problem = patternProblem(pattern)
      if (problem) throw new Error(`${where}: scope "${name}" pattern ${JSON.stringify(pattern)} ${problem}`)
    }
  }
  if (config.proof !== undefined && config.proof !== 'comment') throw new Error(`${where}: "proof" must be "comment" or left out`)
  if (config.proof === 'comment') {
    const ok = Array.isArray(config.reviewers) && config.reviewers.length && config.reviewers.every((r) => typeof r === 'string' && r)
    if (!ok) throw new Error(`${where}: "proof": "comment" needs "reviewers", a list of GitHub logins`)
  }
  return config
}
