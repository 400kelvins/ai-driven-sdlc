import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'

export const DECK_AND_PACKAGE = {
  scopes: {
    deck: {
      include: ['**'],
      exclude: ['packages/**', 'specs/**', '.understand-gate/**', '**/*.md', '!slides.md', '!pages/*.md', '!.understand-gate/config.json'],
    },
    package: { include: ['packages/understand-gate/**'], exclude: [] },
  },
}

/** A throwaway git repo with one commit holding `files` (path -> content). */
export function tempRepo(files, config = DECK_AND_PACKAGE) {
  const dir = mkdtempSync(join(tmpdir(), 'ug-'))
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' })
  git('init', '-q')
  git('config', 'user.email', 'test@example.invalid')
  git('config', 'user.name', 'test')
  git('config', 'commit.gpgsign', 'false')
  write(dir, { ...files, '.understand-gate/config.json': JSON.stringify(config) })
  git('add', '-A')
  git('commit', '-q', '-m', 'init')
  return { dir, git, write: (more) => write(dir, more) }
}

function write(dir, files) {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true })
    writeFileSync(join(dir, path), content)
  }
}
