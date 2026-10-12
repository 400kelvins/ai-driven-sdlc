# Feature Specification: Read-Aloud Gate Review Pack Tool

**Feature Branch**: `002-read-aloud-gate-pack` | **Created**: 2026-10-12 | **Status**: Draft
**Traceability**: BMad Story 2 (`_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`); PRD FR-4, FR-6, FR-14

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hear the gate summary (P1)
The presenter runs one command on a Gate Review Pack or code review file and hears its summary read aloud.
**Acceptance**: Given a pack with a "Summary (read aloud)" section, When `npm run review:speak -- <file>` runs, Then only that section is spoken, with Markdown stripped. Given `--dry-run`, Then the text is printed instead of spoken. Given no summary section, Then the command exits non-zero with a clear message.

### User Story 2 - Every gate uses the same pack shape (P1)
A template defines the pack: summary, what was done (table), estimate vs actual (hours, story points, tokens, dollars, test type), diagram, review findings, decision.
**Acceptance**: Given the template, Then it has each section above; Stories 7 and 9 reuse its estimate fields.

## Requirements *(mandatory)*

- **FR-001**: Command speaks only the "Summary (read aloud)" section of a Markdown file.
- **FR-002**: Markdown syntax (headings, emphasis, links, code ticks, table pipes) is stripped before speaking.
- **FR-003**: `--dry-run` prints the spoken text and does not speak.
- **FR-004**: Missing file or missing summary section exits non-zero with a message.
- **FR-005**: A Gate Review Pack template exists with summary, done table, estimate-vs-actual table (hours, story points, tokens, dollars, test type), diagram, review findings, decision.

## Success Criteria *(mandatory)*

- **SC-001**: Summary of the Story 1 pack is spoken in under 60 seconds.
- **SC-002**: Dry-run output contains no Markdown symbols (#, *, `, |).

## Assumptions

- macOS `say` is the speech engine (presenter's laptop); other OSes fall back to printing.
