// Fingerprint of one scope: its files in HEAD, plus uncommitted, new, and deleted files in it.
// Same method as scripts/gate.mjs, filtered to the scope, so the two agree while they run side by side.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { inScope } from './scopes.mjs'

const lines = (out) => out.split('\n').filter(Boolean)

export function fingerprint(scope, { cwd = process.cwd() } = {}) {
  const git = (...args) => execFileSync('git', ['-c', 'core.quotePath=false', ...args], { cwd, encoding: 'utf8' })
  const mine = (path) => inScope(path, scope)
  const hash = createHash('sha256')
  for (const line of lines(git('ls-tree', '-r', 'HEAD'))) {
    if (mine(line.split('\t')[1])) hash.update(line + '\n')
  }
  const changed = lines(git('diff', 'HEAD', '--name-only')).filter(mine)
  if (changed.length) hash.update(git('diff', 'HEAD', '--', ...changed))
  for (const path of lines(git('ls-files', '--others', '--exclude-standard')).filter(mine)) {
    hash.update(path).update(readFileSync(join(cwd, path)))
  }
  return hash.digest('hex').slice(0, 16)
}
