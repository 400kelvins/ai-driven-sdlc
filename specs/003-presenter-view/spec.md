# Feature Specification: Presenter View with Notes, Clocks, and 20-Minute Countdown

**Feature Branch**: `003-presenter-view` | **Created**: 2026-10-12 | **Status**: Draft
**Traceability**: BMad Story 3 (`_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`); PRD FR-1 (sync), FR-2, FR-3

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Keynote-style presenter screen (P1)
The presenter opens the Presenter View on the laptop and the Audience View on the projector. The Presenter View shows current and next slide, speaker notes, current time, and a countdown from 20:00; the Audience View follows navigation and never shows notes.
**Acceptance**: Given /presenter, Then notes for the current slide, the next-slide preview, the time of day, and a 20:00 countdown are visible. Given navigation in the Presenter View, Then a second Audience window follows. Given the Audience View, Then no notes are visible.

### User Story 2 - Notes stay off the public site (P1)
**Acceptance**: Given the production build, Then /presenter is not available and notes are not rendered.

## Requirements *(mandatory)*

- **FR-001**: Presenter View shows current slide, next-slide preview, and speaker notes.
- **FR-002**: Presenter View shows a countdown starting at 20:00 and the current time of day.
- **FR-003**: Audience View follows Presenter View navigation.
- **FR-004**: Notes never render in the Audience View.
- **FR-005**: Presenter View is available in local dev only, not in the public build.

## Success Criteria *(mandatory)*

- **SC-001**: Countdown reads 20:00 at start.
- **SC-002**: 0 notes visible in the Audience View and on the public site.

## Assumptions

- Presenting is done from the laptop with `npm run dev`.
