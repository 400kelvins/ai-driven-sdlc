import { expect, test } from '@playwright/test'
import { deckSlides, onSlide, slideNo } from './helpers'

const MONITOR = 'Live Monitoring'

test('M jumps to monitoring and M returns to the slide it left', async ({ page }) => {
  const monitor = await slideNo(page, MONITOR)
  const last = (await deckSlides(page)).length
  for (const origin of [2, last]) {
    await page.goto(`/${origin}`)
    await onSlide(page, origin)

    await page.keyboard.press('m')
    await onSlide(page, monitor)
    await expect(page.getByRole('heading', { level: 1, name: MONITOR })).toBeVisible()

    await page.keyboard.press('m')
    await onSlide(page, origin)
  }
})

test('M on the monitoring slide without an origin stays put', async ({ page }) => {
  const monitor = await slideNo(page, MONITOR)
  await page.goto(`/${monitor}`)
  await onSlide(page, monitor)
  await page.keyboard.press('m')
  await onSlide(page, monitor)
  // Arrow keys still work afterwards
  await page.keyboard.press('ArrowRight')
  await onSlide(page, monitor + 1)
})

test('manual navigation clears the return point', async ({ page }) => {
  const monitor = await slideNo(page, MONITOR)
  await page.goto('/2')
  await onSlide(page, 2)
  await page.keyboard.press('m')
  await onSlide(page, monitor)
  await page.keyboard.press('ArrowRight')
  await onSlide(page, monitor + 1)
  await page.keyboard.press('ArrowLeft')
  await onSlide(page, monitor)
  // Arrived by arrows, not by M: M must not jump back to slide 2
  await page.keyboard.press('m')
  await onSlide(page, monitor)
})

test('Cmd+M does not toggle monitoring', async ({ page }) => {
  await page.goto('/2')
  await onSlide(page, 2)
  await page.keyboard.press('Meta+m')
  await onSlide(page, 2)
})
