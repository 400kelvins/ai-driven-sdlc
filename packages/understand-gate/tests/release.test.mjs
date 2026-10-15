// Story 2.5: release prepare / tag. Each test builds a throwaway monorepo with a bare origin.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { appendLines } from '../src/ledger.mjs'
import { fingerprint } from '../src/fingerprint.mjs'
import { loadConfig } from '../src/scopes.mjs'

const SCRIPT = fileURLToPath(new URL('../scripts/release.mjs', import.meta.url))
const CONFIG = {
  scopes: {
    deck: { include: ['**'], exclude: ['packages/**', '.understand-gate/**', '!.understand-gate/config.json'] },
    package: { include: ['packages/understand-gate/**', 'packages/read-listen-see/**'] },
  },
}

function monorepo({ testBody = "import { test } from 'node:test'\ntest('ok', () => {})\n" } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'ug-release-'))
  const origin = join(root, 'origin.git')
  const dir = join(root, 'work')
  execFileSync('git', ['init', '-q', '--bare', '-b', 'main', origin])
  mkdirSync(dir)
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' })
  const write = (files) => {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true })
      writeFileSync(join(dir, path), typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n')
    }
  }
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'test@example.invalid')
  git('config', 'user.name', 'test')
  git('config', 'commit.gpgsign', 'false')
  git('config', 'tag.gpgsign', 'false')
  write({
    'package.json': { name: 'root', private: true, workspaces: ['packages/*'] },
    '.understand-gate/config.json': CONFIG,
    'slides.md': '# Talk',
    'packages/understand-gate/package.json': { name: 'understand-gate', version: '0.0.0', bin: { 'understand-gate': 'bin/u.mjs' }, files: ['bin', 'README.md'] },
    'packages/understand-gate/bin/u.mjs': '',
    'packages/understand-gate/README.md': '# u',
    'packages/understand-gate/tests/ok.test.mjs': testBody,
    'packages/read-listen-see/package.json': { name: 'read-listen-see', version: '0.0.0', dependencies: { 'understand-gate': '0.0.0' } },
  })
  git('add', '-A')
  git('commit', '-qm', 'init')
  git('remote', 'add', 'origin', origin)
  git('push', '-q', 'origin', 'main')
  return { dir, git, write }
}

const release = (dir, ...args) => spawnSync(process.execPath, [SCRIPT, ...args], { cwd: dir, encoding: 'utf8' })
const json = (dir, path) => JSON.parse(readFileSync(join(dir, path), 'utf8'))

/** Records and commits a package review yes for the code as it stands, as the gate and merge would. */
function packageYes(r) {
  const fp = fingerprint(loadConfig(r.dir).scopes.package, { cwd: r.dir })
  appendLines(r.dir, [{ ts: 'now', scope: 'package', stage: 'review', story: 'r', decision: 'yes', fingerprint: fp, proof: null }])
  r.git('add', '-A')
  r.git('commit', '-qm', 'package yes')
}

test('prepare refuses a dirty tree, another branch, a stale main, or a bad bump word', () => {
  const r = monorepo()
  r.write({ 'slides.md': '# dirty' })
  assert.match(release(r.dir, 'prepare', 'minor').stderr, /uncommitted/)
  r.git('commit', '-qam', 'local only')
  assert.match(release(r.dir, 'prepare', 'minor').stderr, /origin\/main/)
  r.git('switch', '-q', '-c', 'other')
  assert.match(release(r.dir, 'prepare', 'minor').stderr, /main/)
  r.git('switch', '-q', 'main')
  r.git('push', '-q', 'origin', 'main')
  const bad = release(r.dir, 'prepare', 'huge')
  assert.equal(bad.status, 2)
  assert.match(bad.stderr, /patch, minor, or major/)
})

test('prepare bumps both packages on a release branch', () => {
  const r = monorepo()
  const out = release(r.dir, 'prepare', 'minor')
  assert.equal(out.status, 0, out.stderr)
  assert.equal(r.git('rev-parse', '--abbrev-ref', 'HEAD').trim(), 'release/understand-gate-0.1.0')
  assert.equal(json(r.dir, 'packages/understand-gate/package.json').version, '0.1.0')
  const alias = json(r.dir, 'packages/read-listen-see/package.json')
  assert.equal(alias.version, '0.1.0')
  assert.equal(alias.dependencies['understand-gate'], '0.1.0')
  assert.equal(r.git('log', '-1', '--format=%s').trim(), 'release: understand-gate@0.1.0')
  assert.equal(r.git('status', '--porcelain'), '')
})

test('semver bumps', () => {
  for (const [word, want] of [['patch', '0.0.1'], ['major', '1.0.0']]) {
    const r = monorepo()
    assert.equal(release(r.dir, 'prepare', word).status, 0)
    assert.equal(json(r.dir, 'packages/understand-gate/package.json').version, want)
  }
})

test('tag refuses without a package review yes for the exact code', () => {
  const r = monorepo()
  const out = release(r.dir, 'tag')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /package: no review decision/)
})

test('tag refuses when versions are out of step, or the tag exists', () => {
  const r = monorepo()
  r.write({ 'packages/read-listen-see/package.json': { name: 'read-listen-see', version: '0.0.1', dependencies: { 'understand-gate': '0.0.0' } } })
  r.git('commit', '-qam', 'skew')
  packageYes(r)
  assert.match(release(r.dir, 'tag').stderr, /in step/)

  const t = monorepo()
  packageYes(t)
  t.git('push', '-q', 'origin', 'main')
  t.git('tag', 'understand-gate@0.0.0')
  assert.match(release(t.dir, 'tag').stderr, /already exists/)
})

test('tag refuses when the package tests fail', () => {
  const r = monorepo({ testBody: "import { test } from 'node:test'\ntest('bad', () => { throw new Error('x') })\n" })
  packageYes(r)
  r.git('push', '-q', 'origin', 'main')
  const out = release(r.dir, 'tag')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /tests failed/)
})

test('tag creates the tag, lists the files, prints the publish commands, and stops', () => {
  const r = monorepo()
  packageYes(r)
  r.git('push', '-q', 'origin', 'main')
  const out = release(r.dir, 'tag')
  assert.equal(out.status, 0, out.stderr)
  assert.equal(r.git('tag', '-l').trim(), 'understand-gate@0.0.0')
  assert.match(out.stdout, /bin\/u\.mjs/)
  assert.doesNotMatch(out.stdout, /tests\/ok\.test\.mjs/)
  assert.match(out.stdout, /git push origin understand-gate@0\.0\.0/)
  assert.match(out.stdout, /npm publish -w understand-gate/)
  assert.match(out.stdout, /npm publish -w read-listen-see/)
  assert.equal(r.git('ls-remote', '--tags', 'origin'), '', 'nothing pushed')
})

test('the release script never publishes or pushes', () => {
  const source = readFileSync(SCRIPT, 'utf8')
  const calls = [...source.matchAll(/(?:git|run|spawnSync|execFileSync)\(([^)]*)\)/g)].map((m) => m[1]).join('\n')
  assert.ok(calls.includes("'tag'"), 'the pattern sees the git helper')
  assert.doesNotMatch(calls, /'publish'|"publish"|'push'|"push"/)
})

test('prepare refuses a version that is not plain major.minor.patch', () => {
  const r = monorepo()
  r.write({ 'packages/understand-gate/package.json': { name: 'understand-gate', version: '1.0.0-rc.1', files: ['bin'] } })
  r.git('commit', '-qam', 'rc')
  r.git('push', '-q', 'origin', 'main')
  const out = release(r.dir, 'prepare', 'patch')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /not plain major\.minor\.patch/)
  assert.equal(r.git('rev-parse', '--abbrev-ref', 'HEAD').trim(), 'main')
  assert.equal(r.git('status', '--porcelain'), '')
})

test('tag refuses local commits that are not on origin', () => {
  const r = monorepo()
  packageYes(r)
  const out = release(r.dir, 'tag')
  assert.equal(out.status, 1)
  assert.match(out.stderr, /origin\/main/)
})

test('tag refuses a version already tagged on origin only', () => {
  const r = monorepo()
  packageYes(r)
  r.git('push', '-q', 'origin', 'main')
  r.git('tag', 'understand-gate@0.0.0')
  r.git('push', '-q', 'origin', 'understand-gate@0.0.0')
  r.git('tag', '-d', 'understand-gate@0.0.0')
  assert.match(release(r.dir, 'tag').stderr, /already exists on origin/)
})
