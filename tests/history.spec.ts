import { expect, test } from '@playwright/test'
import { deckSlides, onSlide, slideNo } from './helpers'

// Story 15 (spec 017): the fear of being replaced is old, and only humans replace humans
test('the two slides sit right before "What\'s left for humans?"', async ({ page }) => {
  const titles = (await deckSlides(page)).map((s) => s.title)
  const left = titles.indexOf("What's left for humans?")
  expect(titles[left - 2]).toBe("We've feared this before")
  expect(titles[left - 1]).toBe('Only humans replace humans')
})

test('"We\'ve feared this before" shows three local historical photos and their credits', async ({ page }) => {
  const n = await slideNo(page, "We've feared this before")
  await page.goto(`/${n}`)
  await onSlide(page, n)
  const slide = page.locator(`.slidev-page-${n}`)
  for (const file of ['luddites-1812', 'switchboard-1911', 'eniac-1946']) {
    const img = slide.locator(`img[src="/history/${file}.jpg"]`)
    await expect(img).toBeVisible()
    expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), file).toBe(true)
    expect(await img.getAttribute('alt'), file).toBeTruthy()
  }
  await expect(slide).toContainText('public domain')
  await expect(slide).toContainText('Bessen')
})

test('"Only humans replace humans" carries its key line and source', async ({ page }) => {
  const n = await slideNo(page, 'Only humans replace humans')
  await page.goto(`/${n}`)
  await onSlide(page, n)
  const slide = page.locator(`.slidev-page-${n}`)
  await expect(slide).toContainText("AI won't replace you. A person who learns to use it will.")
  await expect(slide).toContainText('NBER Working Paper 30389')
})
