import { expect, test, type Page } from '@playwright/test'

// Contract order from specs/001-deck-scaffold/contracts/deck-sections.md
const TITLES = [
  'Goodbye, Manual SDLC?',
  'The AI-Driven SDLC',
  'Demo: Voice to Production',
  'Live Monitoring',
  'Behind the Scenes',
  'Sprint Retrospective',
  'Try It Yourself',
]
const LAST = TITLES.length

function heading(page: Page, n: number) {
  return page.getByRole('heading', { level: 1, name: TITLES[n - 1] })
}

async function expectSlide(page: Page, n: number, from?: number) {
  await expect(page).toHaveURL(new RegExp(`/${n}$`))
  await expect(heading(page, n)).toBeVisible()
  // Wait for the slide transition to finish before the next key press
  if (from && from !== n) await expect(heading(page, from)).toBeHidden()
}

test.beforeEach(async ({ page }) => {
  // Offline-safe (FR-006, Constitution VI): any request off localhost fails the test
  await page.route(/.*/, (route) => {
    const url = route.request().url()
    return url.startsWith('http://localhost:3030') ? route.continue() : route.abort()
  })
})

test('arrow keys move through all sections in order and back', async ({ page }) => {
  await page.goto('/1')
  await expectSlide(page, 1)

  for (let n = 2; n <= LAST; n++) {
    await page.keyboard.press(n % 2 ? 'ArrowDown' : 'ArrowRight')
    await expectSlide(page, n, n - 1)
  }

  // Held key past the last slide stays on the last slide
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight')
  await expectSlide(page, LAST)

  for (let n = LAST - 1; n >= 1; n--) {
    await page.keyboard.press(n % 2 ? 'ArrowUp' : 'ArrowLeft')
    await expectSlide(page, n, n + 1)
  }

  // Held key before the first slide stays on the first slide
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft')
  await expectSlide(page, 1)
})

test('out-of-range slide number falls back to the first slide', async ({ page }) => {
  await page.goto('/99')
  await expect(heading(page, 1)).toBeVisible()
})
