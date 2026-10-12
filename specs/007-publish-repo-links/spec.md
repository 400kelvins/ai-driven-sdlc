# Feature Specification: Publish the Blueprint and Links Slide

**Feature Branch**: `007-publish-repo-links`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "BMad Story 7 (epic-keynote-deck): Publish the repo publicly on GitHub and add a links slide. Publish branch main (only main, never the backup branch) as public repo 400kelvins/ai-driven-sdlc containing the code, BMad Stories, specs, and Gate Review Packs, so attendees can copy the blueprint (PRD FR-16, SM-2). [...] Fill the Links section (pages/links.md, title "Try It Yourself") with the live deck URL and the repo URL, each as a QR code that works offline [...] plus speaker notes (FR-17). Add a README that explains the AI-driven SDLC blueprint and how to run the deck. [...]"

**Traceability**: BMad Story 7 in `_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`; PRD FR-8, FR-16, FR-17, SM-2. Gate 4 approval (2026-10-12): publish publicly.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - An attendee scans and opens the blueprint (Priority: P1)

At the end of the talk the "Try It Yourself" slide shows two codes: one for the live deck and one
for the public repository. An attendee points their phone camera at either code and lands on the
right page.

**Why this priority**: This is the talk's call to action and the "working blueprint" promised in
the talk description.

**Independent Test**: Show the slide with no network; scan each code with a phone; each opens the
expected address.

**Acceptance Scenarios**:

1. **Given** the Links slide is shown with no network, **When** it renders, **Then** both codes and
   their written addresses are visible.
2. **Given** an attendee scans the deck code, **Then** it opens `https://ai-driven-sdlc.vercel.app`.
3. **Given** an attendee scans the repository code, **Then** it opens
   `https://github.com/400kelvins/ai-driven-sdlc`.

---

### User Story 2 - An attendee copies the process from the repository (Priority: P1)

An attendee opens the public repository and can follow the whole lifecycle: the PRD, the Stories,
each spec, the Gate Review Packs and gate decisions, and the code, with a front page that explains
the blueprint and how to run the deck.

**Why this priority**: Every feature must trace to a Story, a gate decision, and an AI review in
the public repository (SM-2).

**Independent Test**: As a signed-out visitor, open the repository and find the PRD, at least one
Story, one spec, one Gate Review Pack, and the gate decision log from the front page.

**Acceptance Scenarios**:

1. **Given** a signed-out visitor, **When** they open the repository, **Then** it is visible
   without signing in.
2. **Given** the front page, **When** the visitor reads it, **Then** it explains the lifecycle,
   the three gates, and links to the PRD, Stories, specs, Gate Review Packs, and gate log.
3. **Given** the front page's run instructions, **When** a developer follows them on a fresh
   checkout, **Then** the deck opens locally.

---

### User Story 3 - Publishing exposes nothing private (Priority: P1)

**Why this priority**: Publishing is effectively irreversible.

**Independent Test**: Inspect the published history and files.

**Acceptance Scenarios**:

1. **Given** the published history, **Then** no commit carries the presenter's personal email.
2. **Given** the published files and history, **Then** no secrets, tokens, or hosting credentials
   appear.
3. **Given** the local backup branch with the old history, **Then** it is not published.

---

### User Story 4 - The release is checked after it ships (Priority: P2)

After this Story ships, the deployment logs are read and reported in a Gate Review Pack.

**Independent Test**: Read the deploy pack; it states the deployment status and any errors.

**Acceptance Scenarios**:

1. **Given** the Story ships, **When** the deployment finishes, **Then** a Gate Review Pack records
   its status and log check.

### Edge Cases

- No network on stage: codes still render because they are part of the deck, not fetched.
- A code is scanned from the back of the room: codes are large enough on a projector (at least a
  quarter of the slide height each).
- Repository name already taken on the account: publishing stops and reports; nothing is renamed
  silently.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Links slide MUST show a scannable code and the written address for the live deck
  and for the public repository.
- **FR-002**: The codes MUST render with no network connection.
- **FR-003**: Each code MUST decode to exactly its written address.
- **FR-004**: The Links slide MUST have speaker notes.
- **FR-005**: The repository MUST be public and contain the code, PRD, Stories, specs, Gate Review
  Packs, and the gate decision log.
- **FR-006**: Only the main line of history MUST be published; the backup of the old history MUST NOT.
- **FR-007**: Published history MUST NOT contain the presenter's personal email, secrets, or tokens.
- **FR-008**: The repository MUST have a front page explaining the blueprint and how to run the deck.
- **FR-009**: After shipping, the deployment status and logs MUST be reported in a Gate Review Pack.

### Key Entities

- **Link**: label, address, code image.
- **Repository**: public home of the blueprint; contains the artifacts listed in FR-005.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 2 of 2 codes decode to their written addresses.
- **SC-002**: A signed-out visitor reaches the PRD, a Story, a spec, a Gate Review Pack, and the gate
  log from the front page in under 1 minute.
- **SC-003**: 0 personal emails, secrets, or tokens in published history.
- **SC-004**: A developer has the deck running locally from the front-page instructions in under
  5 minutes.

## Assumptions

- Account `400kelvins` is authenticated locally for GitHub and Vercel.
- The deck stays at its current hosting address.
- License: Apache-2.0 (presenter decision at the plan gate, 2026-10-12).
- BMad and spec-kit tool folders (`_bmad/`, `.claude/`, `.agents/`, `.specify/`) are published too,
  so the process is reproducible.
