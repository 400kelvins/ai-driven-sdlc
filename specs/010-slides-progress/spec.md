# Feature Specification: Slides Show the PR Workflow, Visual PRs, and the Package Roadmap

**Feature Branch**: `010-slides-progress`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Can we also update the slides to show all of this progress?" (BMad Story 13, GitHub issue #4).

**Traceability**: BMad Story 13 in `_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`;
GitHub issue [#4](https://github.com/400kelvins/ai-driven-sdlc/issues/4). The presenter chose a separate
Story for the slides on 2026-10-14.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The audience sees that the gate is now enforced on GitHub (Priority: P1)

The deck shows that every change now arrives as a pull request with two required checks, tests and
the presenter's yes. AI review comments help but cannot block. The "Gates with teeth" slide no longer
calls CI enforcement a future step.

**Why this priority**: It is the strongest proof point of the talk, and the deck currently says it
is still to come.

**Independent Test**: Open the deck. One slide shows the pull request flow with the two blocking
checks marked as gates. The "Gates with teeth" notes no longer say "Next step: enforce it in CI too".

**Acceptance Scenarios**:

1. **Given** the deck, **Then** a slide shows a PR passing through tests, AI review, slide changes,
   and the human gate before merge, with only tests and the human gate marked as blocking.
2. **Given** the "Gates with teeth" slide, **Then** it says the review gate is enforced at ship and as
   a required GitHub check.

---

### User Story 2 - The audience sees review they can look at (Priority: P1)

A slide shows real before and after images of slide 3 from pull request #6, as the reviewer saw
them, and says that the AI review opens with a diagram.

**Why this priority**: The talk's thesis is "read, listen, and see". This is "see" made real.

**Independent Test**: The slide shows two images side by side, labelled before and after, and works
with no network connection.

**Acceptance Scenarios**:

1. **Given** the deck is opened offline, **Then** both images render.
2. **Given** the slide, **Then** it names the PR the images came from.

---

### User Story 3 - The audience hears the honest moment (Priority: P2)

A slide tells what happened at Story 11's review gate: the quiz was passed, the presenter still said
"No, I didn't understand", and an analogy plus a diagram led to a yes. It ends with the lesson: a
passed quiz does not prove understanding.

**Why this priority**: The talk asks "what's left for humans?". This moment is the answer in action.

**Independent Test**: The slide exists, with speaker notes that tell the story in the first person.

---

### User Story 4 - The audience learns what comes next (Priority: P2)

A slide before "Start on Monday" says the pipeline is becoming an installable package: one command
into any repository, Claude Code and Codex, spoken and quizzed review, the human gate as a required
check, and no yes without understanding.

**Independent Test**: The slide exists and matches the package PRD's decisions.

### Edge Cases

- Speaking time must stay within the 20-minute slot (the existing test).
- Every new slide has speaker notes (the existing test).
- No personal email, token, or internal ID appears on a slide.
- The presenter may rewrite any wording later as a `content:` commit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A slide MUST show the pull request flow, marking tests and the human gate as the only
  blocking checks.
- **FR-002**: The "Gates with teeth" slide and its notes MUST say the review gate is also a required
  GitHub check, and MUST NOT call it a future step.
- **FR-003**: A slide MUST show the before and after images of slide 3 from PR #6, stored in the
  repository so they render offline.
- **FR-004**: A slide MUST tell the Story 11 review-gate "No" and its lesson.
- **FR-005**: A slide MUST present the installable package as what comes next, consistent with the
  package PRD.
- **FR-006**: Every new slide MUST have speaker notes in the presenter's first-person voice, and the
  total estimated speaking time MUST stay within 20 minutes.
- **FR-007**: Existing slide order and section titles MUST stay unchanged, apart from the inserted
  slides.
- **FR-008**: This Story MUST be delivered as a PR that closes issue #4.

### Key Entities

- **Slide**: title, body, speaker notes, position in the deck.
- **Evidence image**: the before or after picture of slide 3 from PR #6.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 4 new slides, each with speaker notes; 0 slides without notes.
- **SC-002**: Estimated speaking time ≤ 20 minutes, including the demo.
- **SC-003**: The deck renders fully with the network off.
- **SC-004**: Every fact on the new slides matches the repository: PR numbers, check names, and the
  gate log.

## Assumptions

- The new slides go into the main talk, after "Gates with teeth" and before "Start on Monday".
  `pages/behind.md` belongs to Story 8 and is not touched.
- The AI drafts the wording and notes; the presenter owns them and may edit them as `content:` commits.
- The PR #6 images (1280×720 PNG, about 15 KB each) are small enough to keep in the repository.
