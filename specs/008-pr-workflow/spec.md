# Feature Specification: PR Workflow with AI Review and a Human Gate Check

**Feature Branch**: `008-pr-workflow`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "BMad Story 11 (epic-keynote-deck), GitHub issue #1: PR workflow. Every next feature arrives as a pull request from a feature branch into main of public repo 400kelvins/ai-driven-sdlc. On every PR, CI runs `npm run verify` [...] and `npm run gate:check` (a review-gate yes in gates.jsonl must cover the PR's exact shipped-file fingerprint). Because GitHub does not allow authors to approve their own PRs, the human gate is a required CI check. The Claude GitHub Action reviews each PR and posts findings as a comment; it needs a CLAUDE_CODE_OAUTH_TOKEN repo secret that the human adds. Branch protection on main requires both checks before merge and blocks direct pushes. /speckit-gate-review includes the PR's AI review comments in the Gate Review Pack. This Story is itself delivered as the repo's first PR, closing issue #1. [...]"

**Traceability**: BMad Story 11 in `_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml`;
GitHub issue [#1](https://github.com/400kelvins/ai-driven-sdlc/issues/1). Approved at the Story 7
review gate (2026-10-12): "yes, after publish".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A change cannot reach main without passing checks and a human yes (Priority: P1)

The presenter (or an AI agent) opens a pull request for a feature. The PR shows two required
checks: the automated quality checks and the human review gate. The merge button stays blocked
until both pass. The human gate passes only when the presenter has said yes at the review gate for
the exact code in the PR.

**Why this priority**: This is the point of the Story: the human gate becomes something GitHub
enforces, not only something the agent is told to respect.

**Independent Test**: Open a PR with no review-gate yes for its code; confirm the merge is blocked.
Record a yes; confirm the gate check turns green and the merge unblocks. Change one shipped file;
confirm the gate check fails again.

**Acceptance Scenarios**:

1. **Given** a PR whose code has no review-gate yes, **When** the checks run, **Then** the human
   gate check fails with a message saying which gate is missing, and the PR cannot merge.
2. **Given** a PR where any test, the build, or the notes-leak check fails, **When** the checks run,
   **Then** the quality check fails and the PR cannot merge.
3. **Given** a review-gate yes is recorded for the PR's exact code and pushed, **When** the checks
   re-run, **Then** both checks pass and the PR can merge.
4. **Given** a yes was recorded, **When** any shipped file in the PR changes afterwards, **Then** the
   human gate check fails until a new yes is recorded.
5. **Given** anyone, including the repository owner, **When** they push directly to main, **Then**
   the push is rejected.

---

### User Story 2 - Every PR gets an AI code review the human can read and hear (Priority: P1)

When a PR opens or receives new commits, an AI reviewer reads the change and posts its findings on
the PR. At the review gate, the Gate Review Pack includes those findings, so the presenter reads,
hears, and sees them in one place before saying yes or no.

**Why this priority**: The talk's thesis is that humans decide by reading, listening, and seeing
the AI's review; the PR is where that review becomes public and auditable.

**Independent Test**: Open a PR; confirm an AI review comment appears on it; run the review gate and
confirm the pack quotes or summarizes that comment.

**Acceptance Scenarios**:

1. **Given** a PR is opened, **When** the AI review runs, **Then** a review comment with findings
   (or an explicit "no findings") appears on the PR.
2. **Given** the AI reviewer cannot run (credential missing or service down), **Then** the PR shows
   the review as failed or skipped, and the merge is not blocked by it.
3. **Given** the review gate is run for a PR, **Then** its Gate Review Pack includes the PR's AI
   review findings and a link to the PR.

---

### User Story 3 - This Story is the first PR (Priority: P2)

The work for this Story is delivered as the repository's first pull request, linked to issue #1,
and merged only after its own checks pass. Merging it closes the issue.

**Why this priority**: It proves the workflow on itself and gives the talk a real, public example.

**Independent Test**: Open the repository's pull requests; PR #1-equivalent shows the checks, the AI
review, the gate pack link, and closes issue #1 on merge.

**Acceptance Scenarios**:

1. **Given** this Story's PR, **When** it is merged, **Then** issue #1 closes automatically.
2. **Given** this Story's PR, **Then** it shows a green quality check, a green human gate check, and
   an AI review comment before merge.

### Edge Cases

- The review-gate yes is recorded in a separate commit after the review: recording a decision must
  not change the fingerprint of shipped files, so the yes still covers the code.
- A PR from a fork: forks get no access to the AI reviewer's credential; the review is skipped and
  the quality and gate checks still run.
- The AI review credential is missing: the review fails visibly but does not block merge; the human
  gate remains the decision.
- Talk-day emergency: the owner can relax protection in repository settings by hand; this is a
  visible, deliberate human act, not something an agent does.
- A deploy still happens only through the existing ship command after merge; merging does not by
  itself deploy unless hosting is already wired to deploy on push (checked during planning).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every PR into main MUST run the full quality checks: unit tests, end-to-end tests,
  build, and the speaker-notes leak check.
- **FR-002**: Every PR into main MUST run the human review gate check against the PR's exact shipped
  code, and fail when no matching yes exists.
- **FR-003**: Main MUST require both checks to pass before a merge, and MUST reject direct pushes,
  including from administrators.
- **FR-004**: An AI reviewer MUST review each PR on open and on new commits and post its findings on
  the PR.
- **FR-005**: The AI review MUST NOT be a required check, so an outage of the reviewer does not block
  the human's decision.
- **FR-006**: The AI reviewer's credential MUST be stored only as a repository secret, added by the
  human; it MUST NOT appear in the repository or its history.
- **FR-007**: The review gate's Gate Review Pack MUST include the PR's AI review findings and the PR
  link when a PR exists for the branch.
- **FR-008**: The repository's front page MUST describe the PR workflow and which checks are
  required.
- **FR-009**: This Story MUST be delivered as a PR that references and closes issue #1.

### Key Entities

- **Pull request**: branch, linked issue, check results, AI review comment, merge state.
- **Required check**: name, pass/fail, reason on failure.
- **Gate decision**: stage, story, decision, fingerprint of shipped code (existing gate log).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of merges into main after this Story come through PRs with both required checks
  green (0 direct pushes accepted).
- **SC-002**: A PR whose shipped code changed after the yes is blocked in 100% of cases.
- **SC-003**: The AI review comment appears on the PR within 10 minutes of opening it.
- **SC-004**: Quality checks on a PR finish in under 10 minutes.
- **SC-005**: 0 secrets or tokens in the repository or its history after this Story.
- **SC-006**: The presenter reviews a PR's AI findings, test results, and gate status from one Gate
  Review Pack, without opening other pages.

## Assumptions

- The presenter runs `claude setup-token` and adds the result as the repository secret
  `CLAUDE_CODE_OAUTH_TOKEN`; the AI reviewer uses the presenter's Claude subscription. Whether
  subscription billing covers it is unverified and noted in the retrospective.
- Local GitHub login may need extra permission to push automation files; the presenter grants it if
  asked.
- The repository owner is the only human reviewer; GitHub forbids self-approval, so the human gate is
  the required gate check, not a GitHub approval.
- The gate log and Gate Review Packs stay excluded from the shipped-code fingerprint, so recording a
  decision does not invalidate it.
- Deploys remain manual through the existing ship command after merge.
