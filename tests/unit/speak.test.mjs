import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { extractSummary, highlightScript, stripMarkdown } from '../../scripts/speak.mjs'

const SCRIPT = fileURLToPath(new URL('../../scripts/speak.mjs', import.meta.url))
const PACK_FIXTURE = fileURLToPath(new URL('../fixtures/gate-pack.md', import.meta.url))

const PACK = `# Pack

## Summary (read aloud)

Story **one** is \`live\` at [the site](https://example.com).

| a | b |
|---|---|
| x | y |

## What was done

Not spoken.
`

test('extracts only the summary section', () => {
  const s = extractSummary(PACK)
  assert.match(s, /Story \*\*one\*\*/)
  assert.doesNotMatch(s, /Not spoken/)
})

test('returns null without a summary section', () => {
  assert.equal(extractSummary('# Title\n\n## Other\n'), null)
})

test('strips markdown symbols', () => {
  const text = stripMarkdown(extractSummary(PACK))
  assert.equal(text, 'Story one is live at the site. a b x y')
  assert.doesNotMatch(text, /[#*`|]/)
})

test('keeps intraword underscores and spaced asterisks', () => {
  assert.equal(stripMarkdown('snake_case_name and 5 * 3 * 2'), 'snake_case_name and 5 * 3 * 2')
  assert.equal(stripMarkdown('_em_ and __strong__'), 'em and strong')
})

test('removes say embedded commands', () => {
  assert.doesNotMatch(stripMarkdown('hello [[rate 500]] world'), /\[\[|\]\]/)
})

test('dry run prints the pack summary', () => {
  const out = execFileSync(process.execPath, [SCRIPT, PACK_FIXTURE, '--dry-run']).toString()
  assert.match(out, /Story one is built/)
  assert.doesNotMatch(out, /[#*`|]/)
})

test('missing file exits non-zero', () => {
  const r = spawnSync(process.execPath, [SCRIPT, 'nope.md', '--dry-run'])
  assert.equal(r.status, 1)
})

test('highlight script runs say interactively from the temp file', () => {
  const script = highlightScript('/var/folders/x/speak-abc/summary.txt')
  assert.match(script, /say --interactive=smso -f '\/var\/folders\/x\/speak-abc\/summary.txt'/)
  assert.match(script, /tell application "Terminal"/)
})

test('highlight script rejects unsafe paths', () => {
  assert.throws(() => highlightScript("/tmp/a'; rm -rf ~; '"), /Unsafe/)
})
