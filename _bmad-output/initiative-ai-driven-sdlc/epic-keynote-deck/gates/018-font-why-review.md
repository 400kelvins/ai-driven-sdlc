# Gate Review Pack — Plan + implement + review (fast track): Story 16, Fjord One and "Why I built it this way"

**PR**: [#24](https://github.com/400kelvins/ai-driven-sdlc/pull/24) (folded in) · **Issue**: #25 · **Date**: 2026-10-15 · **Decision**: yes (2026-10-15, presenter; fast track; quiz passed first try)

## Summary (read aloud)

The whole deck now uses Fjord One, except code. The font is bundled with the deck, so nothing is fetched from Google during the talk, and a test proves it. A new second slide says why the talk looks this way: you work in fintech, you can't show your company's code, so you built the same process in the open, on this deck. No company name appears. The talk is about thirteen and a half minutes.

## Changes

| What | Where |
|---|---|
| Fjord One for all text, code stays monospace | `slides.md` fonts, `styles/index.css`, `@fontsource/fjord-one` 5.3.0 (SIL OFL) |
| New slide 2 "Why I built it this way" + notes | `pages/intro.md` |
| Tests: font loads locally, 0 Google requests, slide 2 text; presenter tests updated | `tests/font-why.spec.ts`, `tests/presenter.spec.ts` |

## Verify

- **170 unit** · **26 e2e** (+3) · build · notes leak ✅ · talk ~13.5 min

## Review (inline, fast track)

| Check | Result |
|---|---|
| Offline | ✅ 0 requests to Google Fonts |
| Confidential info | ✅ "fintech" only, no company name |
| Licence | ✅ SIL Open Font License 1.1 |
| Readability | ✅ screenshots of title, slide 2, and the pipeline diagram |

## Quiz

If the venue Wi-Fi is down, does Fjord One still show?
