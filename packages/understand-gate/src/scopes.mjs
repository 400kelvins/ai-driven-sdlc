// Scopes: named sets of files, each approved and fingerprinted on its own (architecture AD-3).
// Patterns are gitignore-style and match the whole repo-relative path:
//   *  any characters except /      **  any characters, / included
//   an exclude starting with ! re-includes; the last matching exclude wins.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

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
  return new RegExp(`^${out}$`)
}

export function matches(pattern, path) {
  if (!cache.has(pattern)) cache.set(pattern, toRegExp(pattern))
  return cache.get(pattern).test(path)
}

export function inScope(path, scope) {
  if (!scope.include.some((p) => matches(p, path))) return false
  let excluded = false
  for (const p of scope.exclude ?? []) {
    if (p.startsWith('!')) {
      if (matches(p.slice(1), path)) excluded = false
    } else if (matches(p, path)) excluded = true
  }
  return !excluded
}

/** Reads and checks the config; throws an Error with a one-line message. */
export function loadConfig(cwd = process.cwd()) {
  let config
  try {
    config = JSON.parse(readFileSync(join(cwd, CONFIG), 'utf8'))
  } catch (err) {
    throw new Error(`${CONFIG}: ${err.code === 'ENOENT' ? 'not found' : 'not valid JSON'}`)
  }
  const scopes = config?.scopes
  if (!scopes || typeof scopes !== 'object' || !Object.keys(scopes).length) {
    throw new Error(`${CONFIG}: needs at least one scope under "scopes"`)
  }
  for (const [name, scope] of Object.entries(scopes)) {
    const valid = Array.isArray(scope?.include) && (scope.exclude === undefined || Array.isArray(scope.exclude))
    if (!valid) throw new Error(`${CONFIG}: scope "${name}" needs an "include" list and an optional "exclude" list`)
  }
  return config
}
