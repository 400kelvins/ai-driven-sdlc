# Tasks: Deck Scaffold with Arrow-Key Navigation

**Input**: Design documents from `specs/001-deck-scaffold/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/deck-sections.md, quickstart.md
**Tests**: Requested by BMad Story 1 verify line (smoke test of arrows + sections).

## Phase 1: Setup

- [X] T001 Create `package.json` with pinned `@slidev/cli@53.0.0`, `@slidev/theme-default@0.25.0`, `@playwright/test`, and scripts `dev` (`slidev --port 3030`), `build` (`slidev build`), `test` (`playwright test`) in package.json
- [X] T002 Install dependencies and Playwright Chromium (`npm install`, `npx playwright install chromium`)

## Phase 2: Foundational

- [X] T003 Create `slides.md` headmatter: theme default, title "Goodbye, Manual SDLC?", `fonts: { provider: none }`, one slide per section with `src: ./pages/<name>.md` in contract order, in slides.md

## Phase 3: User Story 1 + 2 — Navigate seven section placeholders (P1) 🎯 MVP

**Goal**: Arrow keys move through 7 section title slides in order.
**Independent Test**: `npm test` passes; manual arrows in `npm run dev`.

- [X] T004 [P] [US2] Create `pages/intro.md` with heading "Goodbye, Manual SDLC?"
- [X] T005 [P] [US2] Create `pages/talk.md` with heading "The AI-Driven SDLC"
- [X] T006 [P] [US2] Create `pages/demo.md` with heading "Demo: Voice to Production"
- [X] T007 [P] [US2] Create `pages/monitor.md` with heading "Live Monitoring"
- [X] T008 [P] [US2] Create `pages/behind.md` with heading "Behind the Scenes"
- [X] T009 [P] [US2] Create `pages/retro.md` with heading "Sprint Retrospective"
- [X] T010 [P] [US2] Create `pages/links.md` with heading "Try It Yourself"
- [X] T011 [US1] Create `playwright.config.ts` (Chromium, webServer `npm run dev`, baseURL http://localhost:3030) in playwright.config.ts
- [X] T012 [US1] Write smoke test: 7 headings appear in contract order on ArrowRight/ArrowDown, ArrowLeft/ArrowUp go back, no move past first/last, in tests/smoke.spec.ts
- [X] T013 [US1] Run `npm test` and `npm run build`; confirm `dist/index.html` exists

## Phase 4: User Story 3 — Early preview deploy (P2)

**Goal**: Preview URL serves the deck; logs clean.
**Independent Test**: Open preview URL; `vercel inspect --logs` shows no errors.

- [X] T014 [US3] Create `vercel.json` with `buildCommand: npm run build`, `outputDirectory: dist`, rewrite `/(.*)` → `/index.html` in vercel.json
- [X] T015 [US3] Run `npx vercel --yes` preview deploy; record URL
- [X] T016 [US3] Run `npx vercel inspect <url> --logs`; confirm no errors; fetch URL and confirm HTTP 200

## Phase 5: Polish

- [X] T017 Write Gate Review Pack (summary, table, diagram, estimate vs actual) in _bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/story-1-gate-review.md

## Dependencies

Setup (T001–T002) → Foundational (T003) → US1/US2 (T004–T013) → US3 (T014–T016) → Polish (T017).
T004–T010 run in parallel (separate files).

## Implementation Strategy

MVP = Phase 3: local deck navigable with 7 sections. Phase 4 de-risks hosting.
