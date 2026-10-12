import { expect, test } from '@playwright/test'
import { deckSlides } from './helpers'

const WORDS_PER_MIN = 140
const DEMO_MIN = 3

test('every slide has speaker notes', async ({ page }) => {
  const missing = (await deckSlides(page)).filter((s) => !s.note.trim()).map((s) => `${s.no}: ${s.title}`)
  expect(missing).toEqual([])
})

test('talk closes on the memorable line', async ({ page }) => {
  const titles = (await deckSlides(page)).map((s) => s.title)
  expect(titles.some((t) => t.includes('I thought I only had to prompt'))).toBe(true)
})

test('estimated speaking time fits the 20-minute slot', async ({ page }) => {
  const words = (await deckSlides(page))
    .map((s) => s.note.split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0)
  const minutes = words / WORDS_PER_MIN + DEMO_MIN
  console.log(`notes: ${words} words → ~${minutes.toFixed(1)} min including ${DEMO_MIN} min demo`)
  expect(minutes).toBeLessThanOrEqual(20)
})
