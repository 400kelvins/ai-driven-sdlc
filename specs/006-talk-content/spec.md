# Feature Specification: 20-Minute Talk Content with Speaker Notes

**Feature Branch**: `006-talk-content` | **Created**: 2026-10-12 | **Status**: Draft
**Traceability**: BMad Story 6; PRD §6.1 (talk content), addendum (title, description, Slide 5 and Slide 6 notes)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Deliver the talk narrative (P1)
The presenter steps through Intro and Talk sections that carry the argument: old vs new SDLC, read/listen/see,
the pipeline, tools per stage, Human Gates, estimation, a real catch, what's left for humans, the costs, and
how to start — closing on the memorable line.
**Acceptance**: Given the deck, Then Intro and Talk contain 13–15 slides in the order above; every slide has
speaker notes; slide wording stays business-casual and short (max ~40 words on screen).

### User Story 2 - Fit in 20 minutes (P1)
**Acceptance**: Given the notes, Then estimated speaking time (notes at ~140 words/min plus 3 min demo and
1 min per section break) is 18–20 minutes.

## Requirements *(mandatory)*
- **FR-001**: Intro and Talk sections hold the narrative slides with the existing section title slides first.
- **FR-002**: Every slide in the deck has non-empty speaker notes.
- **FR-003**: Old vs new SDLC shown side by side (addendum Slide 5/6), as diagrams.
- **FR-004**: Statistics on the costs slide name their source.
- **FR-005**: Closing line: "Wow, I can do that much with AI. I thought I only had to prompt."

## Success Criteria *(mandatory)*
- **SC-001**: 100% of slides have notes.
- **SC-002**: Estimated run time 18–20 minutes.

## Assumptions
- Presenter edits wording and notes afterwards (Constitution I exception).
