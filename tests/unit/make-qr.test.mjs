import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { qrSvg } from '../../scripts/make-qr.mjs'

const links = JSON.parse(readFileSync(new URL('../../scripts/links.json', import.meta.url)))

test('links.json has the deck and repo URLs', () => {
  assert.equal(links.deck.url, 'https://ai-driven-sdlc.vercel.app')
  assert.equal(links.repo.url, 'https://github.com/400kelvins/ai-driven-sdlc')
})

test('generator makes an SVG for each link', async () => {
  for (const { url } of Object.values(links)) {
    const svg = await qrSvg(url)
    assert.match(svg, /^<svg[\s\S]*<\/svg>\s*$/)
  }
})

test('committed SVGs match what the generator makes now', async () => {
  for (const [id, { url }] of Object.entries(links)) {
    const committed = readFileSync(new URL(`../../public/qr/${id}.svg`, import.meta.url), 'utf8')
    assert.equal(committed, await qrSvg(url), `public/qr/${id}.svg is stale; run npm run qr`)
  }
})
