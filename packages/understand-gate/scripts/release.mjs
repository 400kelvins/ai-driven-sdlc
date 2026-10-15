#!/usr/bin/env node
// Release understand-gate and its alias read-listen-see (architecture AD-10). Not published.
//
//   npm run release -w understand-gate -- prepare patch|minor|major
//       On a clean main that matches origin/main: a release branch bumping both packages together.
//       It goes through a pull request and the gates like any other change.
//   npm run release -w understand-gate -- tag
//       On main after that branch merged: checks, then tags understand-gate@<version> and stops.
//       It prints the commands to push the tag and publish. It never pushes or publishes.
//
// Exit codes: 0 done, 1 refused, 2 usage.
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fingerprint } from '../src/fingerprint.mjs'
import { repoRoot } from '../src/git.mjs'
import { approval, readLedger } from '../src/ledger.mjs'
import { loadConfig } from '../src/scopes.mjs'

const MAIN_PKG = 'packages/understand-gate/package.json'
const ALIAS_PKG = 'packages/read-listen-see/package.json'
const BUMPS = ['patch', 'minor', 'major']

class Refused extends Error {}
class Usage extends Error {}

function run(cwd, cmd, args) {
  const result = spawnSync(cmd, args, { cwd, encoding: 'utf8' })
  if (result.error) throw new Refused(`${cmd}: ${result.error.message}`)
  return result
}
const git = (cwd, ...args) => {
  const r = run(cwd, 'git', args)
  if (r.status !== 0) throw new Refused(`git ${args[0]}: ${(r.stderr || '').trim().split('\n')[0]}`)
  return r.stdout.trim()
}
const readJson = (root, path) => JSON.parse(readFileSync(join(root, path), 'utf8'))
const writeJson = (root, path, data) => writeFileSync(join(root, path), JSON.stringify(data, null, 2) + '\n')

function onCleanMain(root) {
  const branch = git(root, 'rev-parse', '--abbrev-ref', 'HEAD')
  if (branch !== 'main') throw new Refused(`run this on main, not ${branch}`)
  if (git(root, 'status', '--porcelain')) throw new Refused('commit or stash uncommitted changes first')
}

function bump(version, word) {
  // Plain x.y.z only: Number('0-rc') is NaN, and a build suffix would be silently dropped
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Refused(`version ${version} is not plain major.minor.patch; set it by hand first`)
  }
  const [major, minor, patch] = version.split('.').map(Number)
  if (word === 'major') return `${major + 1}.0.0`
  if (word === 'minor') return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
}

/** Fails unless HEAD is exactly origin/main, so nothing unreviewed is released. */
function matchesOrigin(root) {
  git(root, 'fetch', '-q', 'origin', 'main')
  if (git(root, 'rev-parse', 'HEAD') !== git(root, 'rev-parse', 'origin/main')) {
    throw new Refused('main does not match origin/main; pull or push first')
  }
}

function prepare(root, word) {
  if (!BUMPS.includes(word)) throw new Usage(`prepare needs patch, minor, or major`)
  onCleanMain(root)
  matchesOrigin(root)
  const main = readJson(root, MAIN_PKG)
  const alias = readJson(root, ALIAS_PKG)
  const version = bump(main.version, word)
  const LOCK = 'package-lock.json'
  const hasLock = existsSync(join(root, LOCK))
  const before = Object.fromEntries([MAIN_PKG, ALIAS_PKG, ...(hasLock ? [LOCK] : [])].map((p) => [p, readFileSync(join(root, p), 'utf8')]))
  // Edit on main's working tree first; only a complete edit moves to the new branch
  writeJson(root, MAIN_PKG, { ...main, version })
  writeJson(root, ALIAS_PKG, { ...alias, version, dependencies: { ...alias.dependencies, 'understand-gate': version } })
  if (hasLock) {
    // Workspace versions are recorded in the lockfile too
    const lock = spawnSync('npm', ['install', '--package-lock-only', '--prefer-offline', '--ignore-scripts', '--no-audit', '--no-fund'], {
      cwd: root,
      encoding: 'utf8',
      timeout: 120_000,
    })
    if (lock.status !== 0) {
      for (const [p, text] of Object.entries(before)) writeFileSync(join(root, p), text)
      throw new Refused('npm could not update package-lock.json (it may need the network); nothing was changed')
    }
  }
  git(root, 'switch', '-q', '-c', `release/understand-gate-${version}`)
  git(root, 'add', ...Object.keys(before))
  git(root, 'commit', '-q', '-m', `release: understand-gate@${version}`)
  console.log(`Branch release/understand-gate-${version} is ready. Open a pull request; after it merges, run: npm run release -w understand-gate -- tag`)
}

function tag(root) {
  onCleanMain(root)
  const { version } = readJson(root, MAIN_PKG)
  const alias = readJson(root, ALIAS_PKG)
  if (alias.version !== version || alias.dependencies?.['understand-gate'] !== version) {
    throw new Refused(`versions are not in step: understand-gate ${version}, read-listen-see ${alias.version} depending on ${alias.dependencies?.['understand-gate']}`)
  }
  // Only what was merged on GitHub gets tagged: no local-only commits
  matchesOrigin(root)
  const name = `understand-gate@${version}`
  if (git(root, 'tag', '-l', name)) throw new Refused(`tag ${name} already exists`)
  if (git(root, 'ls-remote', '--tags', 'origin', `refs/tags/${name}`)) throw new Refused(`tag ${name} already exists on origin`)

  // Explicit files: `node --test <dir>` runs nothing, and test globs need Node 21
  const dir = 'packages/understand-gate/tests'
  const testFiles = readdirSync(join(root, dir)).filter((f) => f.endsWith('.test.mjs')).map((f) => `${dir}/${f}`)
  if (!testFiles.length) throw new Refused(`no tests found in ${dir}`)
  // Inside another test run, NODE_TEST_CONTEXT makes a child `node --test` report upward and exit 0
  const { NODE_TEST_CONTEXT, ...env } = process.env
  const tests = spawnSync(process.execPath, ['--test', ...testFiles], { cwd: root, encoding: 'utf8', env })
  if (tests.status !== 0) throw new Refused('package tests failed; run them with: npm test -w understand-gate')

  // On main a ledger yes only arrives through a merged pull request, whose merge needed the reviewer's
  // comment (understand-gate check), so the ledger alone is checked here
  const { scopes } = loadConfig(root)
  const result = approval(readLedger(root), 'package', fingerprint(scopes.package, { cwd: root }))
  if (!result.ok) throw new Refused(`no package review yes for this code: ${result.reason}`)

  const pack = run(root, 'npm', ['pack', '--dry-run', '--json', '-w', 'understand-gate'])
  if (pack.status !== 0) throw new Refused('npm pack --dry-run failed')
  const files = JSON.parse(pack.stdout)[0].files.map((f) => f.path)
  if (files.some((f) => f.startsWith('tests/'))) throw new Refused('the package would publish its tests; fix "files"')

  git(root, 'tag', '-a', name, '-m', `understand-gate ${version}`)
  console.log(`Tagged ${name}. npm would publish:\n${files.map((f) => `  ${f}`).join('\n')}`)
  console.log(`\nNothing was pushed or published. When you are ready, run these yourself:\n`)
  console.log(`  git push origin ${name}`)
  console.log(`  npm publish -w understand-gate`)
  console.log(`  npm publish -w read-listen-see`)
}

function main([cmd, word]) {
  try {
    const root = repoRoot()
    if (cmd === 'prepare') prepare(root, word)
    else if (cmd === 'tag') tag(root)
    else throw new Usage('Usage: release prepare patch|minor|major | release tag')
    return 0
  } catch (err) {
    console.error(err.message.split('\n')[0])
    return err instanceof Usage ? 2 : 1
  }
}

process.exitCode = main(process.argv.slice(2))
