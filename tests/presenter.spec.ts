import { expect, test } from '@playwright/test'

test('presenter view shows notes, next slide, 20:00 countdown, and clock', async ({ page }) => {
  await page.goto('/presenter/1')
  await expect(page.getByText('who still writes requirements docs by hand')).toBeVisible()
  // Next-slide preview renders slide 2
  await expect(page.getByRole('heading', { level: 1, name: 'Try It Yourself' }).first()).toBeAttached()
  // Slidev's presenter timer (TimerInlined): countdown starts at 20:00
  await expect(page.locator('.text-3xl.font-mono').filter({ hasText: /^\s*20\s*:\s*00\s*$/ })).toBeVisible()
  await expect(page.getByTestId('presenter-clock')).toHaveText(/\d{1,2}:\d{2}/)
})

test('audience view follows presenter and never shows notes', async ({ browser }) => {
  const ctx = await browser.newContext()
  const presenter = await ctx.newPage()
  const audience = await ctx.newPage()
  await presenter.goto('/presenter/1')
  await audience.goto('/1')
  await expect(audience.getByRole('heading', { level: 1, name: 'Goodbye, Manual SDLC?' })).toBeVisible()

  await presenter.keyboard.press('ArrowRight')
  await expect(audience).toHaveURL(/\/2(\?|$)/)
  await expect(audience.getByRole('heading', { level: 1, name: 'Try It Yourself' })).toBeVisible()

  await expect(audience.getByText('Before we start: scan these now')).toHaveCount(0)
  await expect(audience.getByTestId('presenter-clock')).toHaveCount(0)
  await ctx.close()
})
