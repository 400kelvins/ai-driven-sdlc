import { expect, test } from '@playwright/test'
import { deckSlides, onSlide, slideNo } from './helpers'

// Story 13 (spec 010): slides that show the PR workflow, visual PRs, and what comes next
const NEW_SLIDES = ['Every change is a pull request', 'Review you can see', 'When I said No', 'Next: install it in your repo']

test('progress slides sit between "Gates with teeth" and "Start on Monday", in order', async ({ page }) => {
  const titles = (await deckSlides(page)).map((s) => s.title)
  const at = (t: string) => titles.indexOf(t)
  for (const t of NEW_SLIDES) expect(at(t), t).toBeGreaterThan(-1)
  const order = ['Gates with teeth', ...NEW_SLIDES, 'Start on Monday'].map(at)
  expect([...order].sort((a, b) => a - b)).toEqual(order)
  expect(at('Every change is a pull request')).toBe(at('Gates with teeth') + 1)
  expect(at('Next: install it in your repo')).toBe(at('Start on Monday') - 1)
})

test('"Gates with teeth" no longer calls CI enforcement a next step', async ({ page }) => {
  const gates = (await deckSlides(page)).find((s) => s.title === 'Gates with teeth')!
  expect(gates.note).not.toMatch(/next step/i)
  expect(gates.note).toMatch(/required check/i)
  await page.goto(`/${gates.no}`)
  await onSlide(page, gates.no)
  await expect(page.locator(`.slidev-page-${gates.no}`)).toContainText('enforced at ship + on GitHub')
})

test('each progress slide carries its key line', async ({ page }) => {
  const lines: Record<string, string> = {
    'Every change is a pull request': 'Robots advise. Tests and I decide.',
    'When I said No': 'A passed quiz is not understanding.',
    'Next: install it in your repo': 'No yes without understanding.',
  }
  for (const [title, line] of Object.entries(lines)) {
    const n = await slideNo(page, title)
    await page.goto(`/${n}`)
    await onSlide(page, n)
    await expect(page.locator(`.slidev-page-${n}`)).toContainText(line)
  }
})

test('"Review you can see" shows the local before and after images', async ({ page }) => {
  const n = await slideNo(page, 'Review you can see')
  await page.goto(`/${n}`)
  await onSlide(page, n)
  for (const side of ['before', 'after']) {
    const img = page.locator(`.slidev-page-${n} img[alt="Slide 3 ${side}"]`)
    await expect(img).toBeVisible()
    // Local file, so it renders with the network off on stage
    expect(await img.getAttribute('src')).not.toMatch(/^https?:/)
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBe(1280)
  }
})
