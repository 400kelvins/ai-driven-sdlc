#!/usr/bin/env node
// Screenshots every slide of a running deck, fully revealed, for the PR slide comparison (spec 009).
//
//   node scripts/slide-shots.mjs <deck-url> <out-dir>      # e.g. http://localhost:3030 /tmp/shots
//
// Writes <out-dir>/NNN.png per slide and prints the slide count.
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [deck, outDir] = process.argv.slice(2)
if (!deck || !outDir) {
  console.error('usage: slide-shots.mjs <deck-url> <out-dir>')
  process.exit(2)
}
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' })
  await page.goto(`${deck}/1`)
  await page.waitForFunction(() => window.__slidev__?.nav?.slides?.length > 0, null, { timeout: 60_000 })
  const total = await page.evaluate(() => window.__slidev__.nav.slides.length)

  for (let n = 1; n <= total; n++) {
    // clicks=999 shows every click step, so a slide is compared in its final state
    await page.goto(`${deck}/${n}?clicks=999`)
    await page.locator(`.slidev-page-${n}`).waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(300)
    await page
      .locator('#slide-content')
      .screenshot({ path: join(outDir, `${String(n).padStart(3, '0')}.png`), animations: 'disabled' })
  }
  console.log(total)
} finally {
  await browser.close()
}
