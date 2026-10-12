import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'
import { onSlide, slideNo } from './helpers'

const links: Record<string, { label: string, url: string }> = JSON.parse(
  readFileSync(new URL('../scripts/links.json', import.meta.url), 'utf8'),
)

test.beforeEach(async ({ page }) => {
  // Offline: the codes must render from the deck itself
  await page.route(/^https?:\/\/(?!localhost:3030)/, (route) => route.abort())
})

test('both QR codes on the links slide decode to their addresses', async ({ page }) => {
  const n = await slideNo(page, 'Try It Yourself')
  await page.goto(`/${n}`)
  await onSlide(page, n)

  for (const [id, { url }] of Object.entries(links)) {
    const img = page.getByTestId(`qr-${id}`)
    await expect(img).toBeVisible()
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0)

    const png = PNG.sync.read(await img.screenshot())
    const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)
    expect(code?.data, `qr-${id}`).toBe(url)
    await expect(page.getByText(url.replace('https://', ''))).toBeVisible()
  }
})

test('QR codes are large enough to scan from the room', async ({ page }) => {
  const n = await slideNo(page, 'Try It Yourself')
  await page.goto(`/${n}`)
  await onSlide(page, n)
  const slide = await page.locator(`.slidev-page-${n}`).boundingBox()
  for (const id of Object.keys(links)) {
    const box = await page.getByTestId(`qr-${id}`).boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(slide!.height / 4)
  }
})
