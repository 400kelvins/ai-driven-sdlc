import { expect, test } from '@playwright/test'
import { deckSlides, onSlide, slideNo } from './helpers'

// Story 19: the presenter introduces themselves right after "0 lines"
test('the intro follows "0 lines" and shows the local screenshot, QR code, and link', async ({ page }) => {
  const titles = (await deckSlides(page)).map((s) => s.title)
  expect(titles[titles.indexOf('0 lines') + 1]).toBe("Hi, I'm Gaurav Sehrawat")
  const n = await slideNo(page, "Hi, I'm Gaurav Sehrawat")
  await page.goto(`/${n}`)
  await onSlide(page, n)
  const slide = page.locator(`.slidev-page-${n}`)
  // By alt text: Slidev rewrites the src of SVG files
  for (const alt of ["Gaurav Sehrawat's LinkedIn profile", "QR code to Gaurav Sehrawat's LinkedIn"]) {
    const img = slide.getByAltText(alt)
    await expect(img).toBeVisible()
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), { message: alt }).toBe(true)
  }
  await expect(slide).toContainText('Solution architect and consultant')
  await expect(slide).toContainText('linkedin.com/in/igauravsehrawat')
})
