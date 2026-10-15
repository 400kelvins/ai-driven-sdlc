import { expect, test } from '@playwright/test'
import { deckSlides, onSlide, slideNo } from './helpers'

// Story 17 (spec 019): why specs, who does what, and what a gate is
const NEW = ['Specs, not prompts', 'BMad for the PRD, spec-kit to build', 'What is a gate?']

test('the three slides follow "The new SDLC", in order', async ({ page }) => {
  const titles = (await deckSlides(page)).map((s) => s.title)
  const at = titles.indexOf('The new SDLC')
  expect(titles.slice(at + 1, at + 4)).toEqual(NEW)
  expect(titles[at + 4]).toBe('Humans read, listen, and see')
})

test('"What is a gate?" says it is the understanding point, with all three gates', async ({ page }) => {
  const n = await slideNo(page, 'What is a gate?')
  await page.goto(`/${n}`)
  await onSlide(page, n)
  const slide = page.locator(`.slidev-page-${n}`)
  await expect(slide).toContainText('The point where I show I understand, before the work moves on.')
  for (const gate of ['Plan gate', 'Code gate', 'Review gate']) await expect(slide).toContainText(gate)
})
