import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const DEMO_SLIDE = '/3'
const fixture = readFileSync(new URL('./fixtures/sample.mp4', import.meta.url))

test('demo slide plays the local recording', async ({ page }) => {
  // Serve a 1-second fixture in place of the real recording; block everything off-host
  await page.route('**/demo/demo.mp4', (route) =>
    route.fulfill({ status: 200, contentType: 'video/mp4', body: fixture }),
  )
  await page.route(/^https?:\/\/(?!localhost:3030)/, (route) => route.abort())

  await page.goto(DEMO_SLIDE)
  const video = page.getByTestId('demo-video')
  await expect(video).toBeVisible()
  await video.evaluate((v: HTMLVideoElement) => { v.muted = true; return v.play() })
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0)
})

test('missing recording shows a fallback message', async ({ page }) => {
  await page.route('**/demo/demo.mp4', (route) => route.fulfill({ status: 404, body: '' }))
  await page.goto(DEMO_SLIDE)
  await expect(page.getByTestId('demo-fallback')).toBeVisible()
  await expect(page.getByTestId('demo-video')).toHaveCount(0)
  // No internal repo paths shown to the audience
  await expect(page.getByText('public/demo')).toHaveCount(0)
})
