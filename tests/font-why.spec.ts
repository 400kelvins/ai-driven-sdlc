import { expect, test } from '@playwright/test'
import { deckSlides, onSlide } from './helpers'

// Story 16 (spec 018): Fjord One, bundled locally, and the "why" slide second
test('the deck uses Fjord One, loaded from the deck itself, never from a font service', async ({ page }) => {
  const remote: string[] = []
  page.on('request', (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) remote.push(r.url())
  })
  await page.goto('/1')
  await onSlide(page, 1)
  const family = await page.locator('.slidev-page-1 h1').evaluate((el) => getComputedStyle(el).fontFamily)
  expect(family).toMatch(/Fjord One/)
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('32px "Fjord One"'))).toBe(true)
  expect(remote).toEqual([])
})

test('code keeps a monospace font', async ({ page }) => {
  await page.goto('/1')
  await onSlide(page, 1)
  const mono = await page.evaluate(() => {
    const el = document.createElement('code')
    document.querySelector('.slidev-page-1')!.appendChild(el)
    return getComputedStyle(el).fontFamily
  })
  expect(mono).not.toMatch(/Fjord One/)
})

test('"Why I built it this way" is slide 3 and says fintech', async ({ page }) => {
  const slides = await deckSlides(page)
  expect(slides[2].title).toBe('Why I built it this way')
  await page.goto('/3')
  await onSlide(page, 3)
  await expect(page.locator('.slidev-page-3')).toContainText("I work in fintech. I can't show you our code.")
})
