import { expect, test } from '@playwright/test'
import { SECTIONS, deckSlides, onSlide } from './helpers'

test.beforeEach(async ({ page }) => {
  // Offline-safe (FR-006, Constitution VI): any request off localhost fails the test
  await page.route(/.*/, (route) => {
    const url = route.request().url()
    return url.startsWith('http://localhost:3030') ? route.continue() : route.abort()
  })
})

test('sections appear in contract order', async ({ page }) => {
  const titles = (await deckSlides(page)).map((s) => s.title)
  // lastIndexOf: "Try It Yourself" also opens the deck at slide 2; its section is the closing one
  const positions = SECTIONS.map((t) => titles.lastIndexOf(t))
  expect(positions.every((p) => p >= 0)).toBe(true)
  expect([...positions].sort((a, b) => a - b)).toEqual(positions)
})

test('slide 2 is Try It Yourself, so the room can scan the QR codes early', async ({ page }) => {
  const titles = (await deckSlides(page)).map((s) => s.title)
  expect(titles[1]).toBe('Try It Yourself')
  await page.goto('/2')
  await onSlide(page, 2)
  await expect(page.getByTestId('qr-deck')).toBeVisible()
  await expect(page.getByTestId('qr-repo')).toBeVisible()
})

test('arrow keys move one slide at a time through the deck and back', async ({ page }) => {
  await page.goto('/1')
  const last = (await deckSlides(page)).length
  await onSlide(page, 1)

  for (let n = 2; n <= last; n++) {
    await page.keyboard.press(n % 2 ? 'ArrowDown' : 'ArrowRight')
    await onSlide(page, n)
  }

  // Held key past the last slide stays on the last slide
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight')
  await onSlide(page, last)

  for (let n = last - 1; n >= 1; n--) {
    await page.keyboard.press(n % 2 ? 'ArrowUp' : 'ArrowLeft')
    await onSlide(page, n)
  }

  // Held key before the first slide stays on the first slide
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft')
  await onSlide(page, 1)
})

test('out-of-range slide number falls back to the first slide', async ({ page }) => {
  await page.goto('/999')
  await expect(page.getByRole('heading', { level: 1, name: SECTIONS[0] })).toBeVisible()
})
