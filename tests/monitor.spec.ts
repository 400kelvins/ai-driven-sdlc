import { expect, test } from '@playwright/test'

const MONITOR = 'Live Monitoring'

async function onSlide(page: import('@playwright/test').Page, n: number) {
  await expect(page).toHaveURL(new RegExp(`/${n}(\\?|$)`))
  // Wait until the slide has rendered, so keyboard shortcuts are registered
  await expect(page.locator(`.slidev-page-${n} h1`)).toBeVisible()
}

for (const origin of [2, 6]) {
  test(`M jumps to monitoring and M returns to slide ${origin}`, async ({ page }) => {
    await page.goto(`/${origin}`)
    await onSlide(page, origin)

    await page.keyboard.press('m')
    await onSlide(page, 4)
    await expect(page.getByRole('heading', { level: 1, name: MONITOR })).toBeVisible()

    await page.keyboard.press('m')
    await onSlide(page, origin)
  })
}

test('M on the monitoring slide without an origin stays put', async ({ page }) => {
  await page.goto('/4')
  await page.keyboard.press('m')
  await onSlide(page, 4)
  // Arrow keys still work afterwards
  await page.keyboard.press('ArrowRight')
  await onSlide(page, 5)
})

test('manual navigation clears the return point', async ({ page }) => {
  await page.goto('/2')
  await onSlide(page, 2)
  await page.keyboard.press('m')
  await onSlide(page, 4)
  await page.keyboard.press('ArrowRight')
  await onSlide(page, 5)
  await page.keyboard.press('ArrowLeft')
  await onSlide(page, 4)
  // Arrived by arrows, not by M: M must not jump back to slide 2
  await page.keyboard.press('m')
  await onSlide(page, 4)
})

test('Cmd+M does not toggle monitoring', async ({ page }) => {
  await page.goto('/2')
  await onSlide(page, 2)
  await page.keyboard.press('Meta+m')
  await onSlide(page, 2)
})
