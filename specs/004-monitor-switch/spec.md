# Feature Specification: Switch to Live Monitoring and Back

**Feature Branch**: `004-monitor-switch` | **Created**: 2026-10-12 | **Status**: Draft
**Traceability**: BMad Story 4 (`_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`); PRD FR-19

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jump to monitoring and return (P1)
Mid-talk, the presenter presses M. The deck jumps to the Live Monitoring slide, which tells the audience to watch the live Claude Code session and shows the shortcut to switch apps. Pressing M again returns to the exact slide the presenter left.
**Acceptance**: Given slide N, When M is pressed, Then the monitoring slide shows. When M is pressed again, Then slide N shows. Given the monitoring slide reached by arrows, When M is pressed, Then nothing breaks (stays).

## Requirements *(mandatory)*

- **FR-001**: Key M jumps to the monitoring slide from any slide and remembers the origin.
- **FR-002**: Key M on the monitoring slide returns to the remembered origin slide.
- **FR-003**: The monitoring slide states what the audience is about to see (live Claude Code session) and the app-switch shortcut (⌘-Tab).
- **FR-004**: Existing navigation keys keep working.

## Success Criteria *(mandatory)*

- **SC-001**: Round trip M → M returns to the origin slide 100% of the time.

## Assumptions

- The live Claude Code session is shown by switching apps on the laptop (⌘-Tab); the deck cannot embed a terminal.
