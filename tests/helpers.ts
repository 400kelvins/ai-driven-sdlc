import { expect, type Page } from '@playwright/test'

// Section title slides, in contract order (specs/001-deck-scaffold/contracts/deck-sections.md)
export const SECTIONS = [
  'Goodbye, Manual SDLC?',
  'The AI-Driven SDLC',
  'Demo: Voice to Production',
  'Live Monitoring',
  'Behind the Scenes',
  'Sprint Retrospective',
  'Try It Yourself',
]

export type SlideInfo = { no: number; title: string; note: string }

/** Reads the deck's slide list from the running Slidev app. */
export async function deckSlides(page: Page): Promise<SlideInfo[]> {
  if (!page.url().startsWith('http')) await page.goto('/1')
  await page.waitForFunction(() => (window as any).__slidev__?.nav?.slides?.length > 0)
  return page.evaluate(() =>
    (window as any).__slidev__.nav.slides.map((s: any) => ({
      no: s.no,
      title: s.meta?.slide?.title ?? '',
      note: s.meta?.slide?.note ?? '',
    })),
  )
}

/** Slide number of the section title slide with this exact title. */
export async function slideNo(page: Page, title: string): Promise<number> {
  const found = (await deckSlides(page)).find((s) => s.title === title)
  if (!found) throw new Error(`No slide titled "${title}"`)
  return found.no
}

/** Waits until slide n is current and rendered, so shortcuts are registered. */
export async function onSlide(page: Page, n: number) {
  await expect(page).toHaveURL(new RegExp(`/${n}(\\?|$)`))
  await expect(page.locator(`.slidev-page-${n}`)).toBeVisible()
}
