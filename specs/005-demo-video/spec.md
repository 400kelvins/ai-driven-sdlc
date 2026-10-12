# Feature Specification: Embedded Offline Demo Video

**Feature Branch**: `005-demo-video` | **Created**: 2026-10-12 | **Status**: Draft
**Traceability**: BMad Story 5 (`_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`); PRD FR-15

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play the recorded demo inside the deck (P1)
On the Demo slide the recording plays inside the deck from a local file, with no network.
**Acceptance**: Given public/demo/demo.mp4 exists, When the Demo slide shows, Then a video player loads it from the deck's own server and plays. Given no network, Then playback still works.

### User Story 2 - Missing recording does not break the talk (P2)
**Acceptance**: Given the file is missing, Then the slide shows a clear "recording not added yet" message instead of a broken player.

## Requirements *(mandatory)*

- **FR-001**: Demo slide plays `public/demo/demo.mp4` with standard controls.
- **FR-002**: Video is served locally; no external requests.
- **FR-003**: If the file fails to load, the slide shows a fallback message.
- **FR-004**: How to add the recording (path, MP4/H.264, under 3 minutes, compression command) is documented.

## Success Criteria *(mandatory)*

- **SC-001**: Video starts playing within 2 seconds of the slide showing, offline.

## Assumptions

- Final recording (MP4, < 3 min) is supplied by the presenter (hitl).
