// Git, called safely: literal pathspecs, NUL-separated output, large buffer, git's own stderr kept.
import { execFileSync } from 'node:child_process'

const MAX_BUFFER = 1024 * 1024 * 1024

export function git(cwd, ...args) {
  return execFileSync('git', ['--literal-pathspecs', ...args], {
    cwd,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

export const entries = (out) => out.split('\0').filter(Boolean)

export function repoRoot(cwd = process.cwd()) {
  return git(cwd, 'rev-parse', '--show-toplevel').trim()
}

/** Files changed against `ref` in the working tree, plus untracked files; renames count as both paths. */
export function changedSince(root, ref) {
  return [
    ...entries(git(root, 'diff', '--name-only', '-z', '--no-renames', ref)),
    ...entries(git(root, 'ls-files', '-z', '--others', '--exclude-standard')),
  ]
}
