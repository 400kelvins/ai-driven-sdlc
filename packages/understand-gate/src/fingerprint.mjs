// Fingerprint of one scope: its files in HEAD, plus uncommitted, new, and deleted files in it.
// Any change to a file in the scope must move it, whatever the file is named; git output is read
// NUL-separated, never quoted, and diff output is pinned so local and CI runs agree.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { lstatSync, readFileSync, readlinkSync } from 'node:fs'
import { join } from 'node:path'
import { inScope } from './scopes.mjs'

const MAX_BUFFER = 1024 * 1024 * 1024
const DIFF = ['diff', 'HEAD', '--binary', '--no-color', '--no-ext-diff', '--no-textconv', '--no-renames']

export function repoRoot(cwd = process.cwd()) {
  return run(cwd, 'rev-parse', '--show-toplevel').trim()
}

function run(cwd, ...args) {
  return execFileSync('git', ['--literal-pathspecs', ...args], {
    cwd,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

const entries = (out) => out.split('\0').filter(Boolean)

/** Length-prefixed, so two different (path, content) pairs never hash the same bytes. */
function frame(hash, ...parts) {
  for (const part of parts) {
    const buf = Buffer.isBuffer(part) ? part : Buffer.from(part)
    hash.update(`${buf.length}:`).update(buf)
  }
}

export function fingerprint(scope, { cwd = process.cwd() } = {}) {
  const root = repoRoot(cwd)
  const git = (...args) => run(root, ...args)
  const mine = (path) => inScope(path, scope)
  const hash = createHash('sha256')
  let files = 0

  for (const entry of entries(git('ls-tree', '-r', '-z', '--full-tree', 'HEAD'))) {
    const tab = entry.indexOf('\t')
    const path = entry.slice(tab + 1)
    if (!mine(path)) continue
    if (entry.startsWith('160000 ')) throw new Error(`scope covers submodule ${path}; submodules are not supported`)
    frame(hash, 'tree', entry)
    files++
  }

  const changed = entries(git(...DIFF, '--name-only', '-z')).filter(mine)
  if (changed.length) frame(hash, 'diff', git(...DIFF, '--', ...changed))

  for (const path of entries(git('ls-files', '-z', '--others', '--exclude-standard')).filter(mine)) {
    const full = join(root, path)
    const stat = lstatSync(full)
    const body = stat.isSymbolicLink() ? readlinkSync(full) : readFileSync(full)
    frame(hash, 'new', path, (stat.mode & 0o170777).toString(8), body)
    files++
  }

  if (!files && !changed.length) throw new Error('scope matches no files; check its include patterns')
  return hash.digest('hex').slice(0, 16)
}
