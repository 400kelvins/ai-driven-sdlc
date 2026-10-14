# Feature Specification: Visual PRs, a Diagram and Slide Screenshots on Every Pull Request

**Feature Branch**: `009-pr-visuals`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "BMad Story 12 (epic-keynote-deck), GitHub issue #3: visual PRs. Every pull request into main of 400kelvins/ai-driven-sdlc shows the human reviewer what changed without reading code. (1) Diagram: the existing AI review comment always includes a Mermaid diagram of what the change does [...] (2) Screenshots: CI renders every slide of the deck at the PR's base and at its head, keeps only the slides whose image changed, and shows before/after pairs inline in one PR comment [...] (3) Storage: images live on a separate `pr-assets` branch [...] never on main [...] (4) Safety: the job that builds PR code is read-only; a separate job that runs no PR code is the only one that writes [...] (5) The screenshot comment is advisory [...] The gate review pack (`npm run pr:review`) also includes the screenshot comment. [...]"

**Traceability**: BMad Story 12 in `_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`;
GitHub issue [#3](https://github.com/400kelvins/ai-driven-sdlc/issues/3). Asked for by the presenter on
2026-10-14 ("can we add some screenshots and diagrams in pr always?"); storage on a `pr-assets` branch
chosen by the presenter.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The reviewer sees exactly which slides changed (Priority: P1)

The presenter opens a pull request. A few minutes later, one comment on the PR shows a before and
after picture of each slide the change touched, side by side. Slides that look the same are left
out. If no slide looks different, the comment says "No slide changed".

**Why this priority**: The talk's thesis is that review should not mean reading walls of code. For a
slide deck, a picture of the slide is the change.

**Independent Test**: Open a PR that edits one slide's wording; confirm the comment shows before and
after images of that slide only. Open a PR that changes only a script; confirm the comment says
"No slide changed".

**Acceptance Scenarios**:

1. **Given** a PR that changes how one slide looks, **When** the checks run, **Then** one comment shows
   that slide's number with its before and after images, inline, and no other slide.
2. **Given** a PR that changes no slide's appearance, **When** the checks run, **Then** the comment
   says "No slide changed".
3. **Given** a PR that adds a new slide, **Then** the comment shows it as new, with no before image.
4. **Given** a PR that removes a slide, **Then** the comment shows it as removed, with no after image.
5. **Given** new commits are pushed to the PR, **When** the checks re-run, **Then** the same comment is
   updated to match the latest commit, rather than a new comment being added.

---

### User Story 2 - The AI review explains the change with a diagram (Priority: P1)

The existing AI review comment always contains a diagram of what the change does: which parts it
touches and how they connect. GitHub draws the diagram inline, so the reviewer sees the shape of the
change before reading any finding.

**Why this priority**: The review gate's first "No" on Story 11 came from not understanding. A
diagram was what made it clear.

**Independent Test**: Open any PR; confirm the AI review comment contains a diagram that GitHub
renders as a picture, not as raw text.

**Acceptance Scenarios**:

1. **Given** a PR, **When** the AI review is posted, **Then** it contains a diagram of the change
   before the findings.
2. **Given** a diagram the AI wrote fails to render, **Then** the review's findings are still posted
   and readable.

---

### User Story 3 - The gate pack shows the pictures too (Priority: P2)

At the review gate, the Gate Review Pack includes the screenshot comment as well as the AI review,
so the presenter reads, hears, and sees everything in one place.

**Why this priority**: The pack is where the yes or no is decided; the pictures must be there.

**Independent Test**: Run the PR review command for a PR with a screenshot comment; confirm its output
includes the screenshot comment and the AI review.

**Acceptance Scenarios**:

1. **Given** a PR with both comments, **When** the PR review command runs, **Then** it prints both.
2. **Given** a comment that looks like a screenshot comment but was written by someone other than the
   repository's automation, **Then** it is ignored.

---

### User Story 4 - Pictures never pollute main, and PR code never gets write access (Priority: P1)

Screenshots are stored on a separate branch, in a folder per PR and commit. The job that builds and
renders the PR's code can only read. A separate job, which runs none of the PR's code, is the only
one that saves images and posts the comment.

**Why this priority**: The PR's code is untrusted until reviewed. Giving it write access would let a
bad change rewrite the repository.

**Independent Test**: After a PR merges, confirm main contains no new image files. Inspect the
workflow and confirm the rendering job has read-only permissions and the writing job never checks
out or runs PR code.

**Acceptance Scenarios**:

1. **Given** a merged PR, **Then** main contains no screenshot files.
2. **Given** a PR from a fork, **Then** no screenshots are produced, and the PR shows a visible note
   saying why.
3. **Given** the screenshot job fails, **Then** the PR can still merge; the comment says the
   screenshots could not be made.

### Edge Cases

- Rendering is slightly different between two runs of the same slide (animations, fonts loading):
  pictures must be taken in a settled state so unchanged slides are not reported as changed.
- Many slides change at once (for example a theme change): the comment stays readable, limited to a
  fixed number of pairs, with a note saying how many more changed.
- The base of the PR cannot be built (for example main is broken): the comment shows the after images
  only and says the before images are missing.
- Slides with click steps: each slide is captured in its final, fully revealed state.
- Speaker notes never appear in screenshots.
- The `pr-assets` branch does not exist yet: it is created on first use.
- Old screenshots pile up on the `pr-assets` branch: accepted for now; cleanup is out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: For every PR into main, CI MUST render every slide at the PR's base and at its head, and
  determine which slides look different.
- **FR-002**: One PR comment MUST show, inline, the before and after images of each changed slide,
  labelled with the slide number; new slides show after only, removed slides show before only.
- **FR-003**: When no slide looks different, the comment MUST say "No slide changed".
- **FR-004**: The comment MUST be updated in place when the PR gets new commits, and MUST show which
  commit its images are from.
- **FR-005**: Images MUST be stored on a separate `pr-assets` branch, in a folder per PR and commit,
  and MUST NOT be added to main.
- **FR-006**: The job that builds or runs PR code MUST have read-only access to the repository and
  the PR.
- **FR-007**: Only a separate job that runs no PR code MAY write images to the `pr-assets` branch and
  post the comment.
- **FR-008**: The AI reviewer MUST NOT gain any write access through this Story.
- **FR-009**: The AI review comment MUST include a diagram of what the change does, before the
  findings.
- **FR-010**: PRs from forks MUST be skipped with a visible note; the screenshot job MUST NOT be a
  required check.
- **FR-011**: The PR review command used by the review gate MUST include the screenshot comment,
  trusting only comments written by the repository's automation.
- **FR-012**: The comment MUST show at most 10 before/after pairs and say how many more slides changed.
- **FR-013**: Unchanged slides MUST NOT be reported as changed when the same code is rendered twice.
- **FR-014**: This Story MUST be delivered as a PR that closes issue #3.

### Key Entities

- **Slide snapshot**: slide number, image, commit it was rendered from (base or head).
- **Slide change**: slide number, kind (changed, new, removed), before and after snapshots.
- **Screenshot comment**: PR, head commit, list of slide changes or "No slide changed", overflow count.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A PR that changes one slide shows exactly that slide in 100% of runs, with 0 unchanged
  slides reported.
- **SC-002**: The screenshot comment appears within 10 minutes of opening or updating a PR.
- **SC-003**: 0 image files are added to main by this feature.
- **SC-004**: 100% of AI review comments after this Story contain a diagram.
- **SC-005**: At the review gate, the presenter sees the pictures, the diagram, and the findings in
  one pack, without opening other pages.

## Assumptions

- The repository stays public, so images on the `pr-assets` branch can be shown inline in PR comments.
- The deck renders the same way on the CI machine for the same commit, once it is settled.
- `main` stays the only protected branch; the `pr-assets` branch is written only by automation.
- Old screenshots are kept; cleaning up the `pr-assets` branch is a later Story.
- Screenshots cover the slide deck only, which is the whole product of this repository.
