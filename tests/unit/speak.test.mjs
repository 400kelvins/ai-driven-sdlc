import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { extractSummary, stripMarkdown } from '../../scripts/speak.mjs'

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

test('dry run prints the Story 1 pack summary', () => {
  const out = execFileSync('node', [
    'scripts/speak.mjs',
    '_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/story-1-gate-review.md',
    '--dry-run',
  ]).toString()
  assert.match(out, /Story one is built/)
  assert.doesNotMatch(out, /[#*`|]/)
})

test('missing file exits non-zero', () => {
  const r = spawnSync('node', ['scripts/speak.mjs', 'nope.md', '--dry-run'])
  assert.equal(r.status, 1)
})
