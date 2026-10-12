# Feature Specification: Deck Scaffold with Arrow-Key Navigation

**Feature Branch**: `001-deck-scaffold`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "BMad Story 1 (epic-keynote-deck): Slidev scaffold with arrow-key navigation. Stand up a Slidev deck served locally with arrow-key navigation (right/down advance, left/up go back) and a one-file-per-section layout via Slidev src imports: slides.md plus pages/intro.md, pages/talk.md, pages/demo.md, pages/monitor.md, pages/behind.md, pages/retro.md, pages/links.md, each with a placeholder title slide. Verify: npm run dev serves the deck; arrows navigate; each section renders; npm run build succeeds; then an early Vercel preview deploy serves it with clean logs. Covers PRD FR-1 (keys part)."

**Traceability**: BMad Story 1 in `_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`; PRD FR-1 (arrow keys), FR-7 (local first, then deploy).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Presenter steps through the deck with arrow keys (Priority: P1)

The presenter opens the deck on their laptop and moves through the slides with the keyboard arrow
keys, the same way they would in Apple Keynote.

**Why this priority**: Without a deck that opens and navigates, nothing else in the talk works.
This is the first, thinnest working version the rest of the epic builds on.

**Independent Test**: Start the deck locally, open it in a browser, and press each arrow key.

**Acceptance Scenarios**:

1. **Given** the deck is open on the first slide, **When** the presenter presses → or ↓,
   **Then** the next slide appears.
2. **Given** the deck is on any slide after the first, **When** the presenter presses ← or ↑,
   **Then** the previous slide appears.
3. **Given** the deck is on the last slide, **When** the presenter presses → or ↓,
   **Then** the deck stays on the last slide without error.

---

### User Story 2 - Every talk section has its own placeholder (Priority: P1)

The deck is split into seven sections, each kept separately, so later Stories can fill one section
without touching another: Intro, Talk, Demo, Monitor, Behind the Scenes, Retrospective, Links.

**Why this priority**: Later Stories run in parallel; separate sections prevent them colliding.

**Independent Test**: Step through the whole deck and confirm a title slide for each of the seven
sections appears, in order.

**Acceptance Scenarios**:

1. **Given** the deck is open, **When** the presenter steps from start to end,
   **Then** they see the seven section title slides in the order listed above.
2. **Given** a section's content is changed, **When** the deck reloads,
   **Then** only that section's slides change.

---

### User Story 3 - The deck is reachable online early (Priority: P2)

After the deck works locally, a preview copy is published on the hosting provider so hosting
problems show up two days before the talk, not on the day.

**Why this priority**: De-risks hosting early; local use already covers the talk itself.

**Independent Test**: Open the preview URL in a browser and step through the slides; read the
deployment logs for errors.

**Acceptance Scenarios**:

1. **Given** the deck passes local checks, **When** a preview deploy runs,
   **Then** the preview URL serves the same seven section slides.
2. **Given** the preview deploy has finished, **When** the deployment logs are read,
   **Then** they show no errors.

---

### Edge Cases

- Key held down: the deck advances repeatedly but never past the last slide or before the first.
- Browser opened directly on a slide number beyond the end: the deck falls back to the first slide
  (built-in behavior; amended 2026-10-12 after the smoke test showed it, per Constitution V).
- Preview deploy fails: no further action; failure and log excerpt are reported at the Gate, the
  local deck remains usable for the talk.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The deck MUST advance one slide on → or ↓ and go back one slide on ← or ↑.
- **FR-002**: The deck MUST NOT move past the first or last slide.
- **FR-003**: The deck MUST consist of seven sections — Intro, Talk, Demo, Monitor, Behind the
  Scenes, Retrospective, Links — each stored separately and each showing a placeholder title slide.
- **FR-004**: Sections MUST appear in the order listed in FR-003.
- **FR-005**: The deck MUST run locally with a single start command and build to static files with
  a single build command.
- **FR-006**: The deck MUST render with no network connection once started locally.
- **FR-007**: After local checks pass, a preview of the deck MUST be published and its deployment
  logs checked and reported.

### Key Entities

- **Section**: A named group of slides stored on its own (one of the seven); has a title slide.
- **Slide**: One screen of the deck, belonging to exactly one Section.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From a fresh checkout, the presenter has the deck open locally in under 2 minutes.
- **SC-002**: 100% of arrow-key presses move exactly one slide in the expected direction.
- **SC-003**: All 7 section title slides appear, in order, both locally and on the preview URL.
- **SC-004**: The preview deploy reports zero errors in its logs.

## Assumptions

- The presenter uses a laptop with a physical keyboard; clickers that send arrow keys also work.
- Section placeholders hold only a title; content arrives in later Stories (2–9).
- The preview deploy uses the presenter's existing hosting account (`400kelvins`), already logged in.
- The deck's visual theme is a neutral, business-casual default; styling is refined in later Stories.
