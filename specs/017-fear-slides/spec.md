# Feature Specification: We've Feared This Before, and Only Humans Replace Humans

**Feature Branch**: `017-fear-slides` · **Created**: 2026-10-15 · **Status**: Draft · **Fast track**: the talk is in ~2 hours (presenter's choice).

**Input**: "I want to add some images of how there has been constant fear of humans being replaced by ai but it only creates more job because there are more moving parts. only humans can replace human, we need efforts and actions to survive" — BMad Story 15, GitHub issue [#23](https://github.com/400kelvins/ai-driven-sdlc/issues/23).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The audience sees the fear is old (Priority: P1)

A slide shows, with real historical photos, that each wave of technology brought the fear of replacement, and what happened next: 1812 looms, 1911 telephone operators, 1946 computers, ATMs, and AI today.

**Acceptance Scenarios**:

1. **Given** the deck opened offline, **Then** all three photos render from the repository.
2. **Given** the slide, **Then** it credits the photos and the ATM figures.

### User Story 2 - The audience hears the answer (Priority: P1)

A slide says only humans replace humans: about 60% of 2018 US jobs were in job types that did not exist in 1940; more moving parts need more people; effort and action are how we stay.

## Requirements *(mandatory)*

- **FR-001**: Two new slides, right before "What's left for humans?", in this order.
- **FR-002**: Photos are public domain, stored in the repository, with alt text and a credit line.
- **FR-003**: Every figure on the slides names its source.
- **FR-004**: Every new slide has speaker notes in the presenter's voice; the talk stays within 20 minutes.

## Success Criteria *(mandatory)*

- **SC-001**: 2 new slides, 3 local photos, 0 remote image URLs.
- **SC-002**: Talk estimate ≤ 20 minutes (now ~13.0).

## Assumptions

- Licences checked on Wikimedia Commons on 2026-10-15: all three tagged Public domain (1812 engraving; Library of Congress 1911, published before 1929; U.S. Army photo 1946).
- ATM figures as reported from Bessen (IMF F&D, 2015) by secondary sources; the 60% figure from Autor et al., NBER w30389 (2022).
