# Feature Specification: CI Runs the Checker and Config from Main, with Path Filters

**Feature Branch**: `013-ci-from-main`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "done, merged, please continue" — Story 2.3 of epic `epic-gate-core` (GitHub issue #14).
The presenter chose `pull_request_target` (option A) on 2026-10-15.

**Traceability**: BMad Story 2.3 in `_bmad-output/initiative-ai-driven-sdlc/epic-gate-core/tickets.toml`;
GitHub issue [#14](https://github.com/400kelvins/ai-driven-sdlc/issues/14); architecture AD-2, AD-3;
package PRD FR-22.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A pull request cannot weaken its own gate (Priority: P1)

Every pull request gets an `understand-gate` check whose workflow, checker, and scope config all come
from the main branch. The pull request's files are only read. Editing the workflow, the checker, or the
config inside the pull request does not change how that pull request is judged.

**Why this priority**: It is the point of the epic: the gate holds even against the branch it judges.

**Independent Test**: A throwaway pull request that changes package code and edits the config so the
package scope covers nothing fails `understand-gate`, naming the package.

**Acceptance Scenarios**:

1. **Given** a pull request touching the package with no package review yes, **Then** `understand-gate` fails and names the package.
2. **Given** the same pull request also edits the config, the checker, or the workflow, **Then** the result is the same.
3. **Given** every touched scope has a matching review yes in the committed ledger, **Then** `understand-gate` passes.
4. **Given** a pull request touching only planning documents, **Then** `understand-gate` passes.

---

### User Story 2 - Recording a decision feeds both gates (Priority: P1)

When the presenter answers a gate, the decision is recorded in the existing log and, for every area the
branch touched, in the understand-gate ledger, so both checks can pass until Story 2.6 retires the old one.

**Independent Test**: Recording a review yes on a branch touching the deck and the package adds one old-log
line and two ledger lines.

---

### User Story 3 - Tests run only for the area that changed (Priority: P2)

A pull request that changes only the deck skips the package tests; one that changes only the package skips
the browser tests and the deck build; one that changes only planning documents runs neither. Pushes to main
run everything.

**Independent Test**: A deck-only pull request's `verify` log shows the package tests skipped.

### Edge Cases

- Pull requests from forks get no `understand-gate` result, so they stay blocked until a maintainer acts.
- The `verify` check always reports, even when it skips everything, so it never stays pending.
- The new check cannot run on the pull request that adds it; it applies from the next pull request.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A new check `understand-gate` MUST run on every pull request to main, from the main branch's workflow definition.
- **FR-002**: It MUST run the checker and read the scope config from main, against the pull request's head, without running any of the pull request's code.
- **FR-003**: It MUST have read-only repository access and keep no credentials in the checkout.
- **FR-004**: Recording a gate decision MUST also record it in the understand-gate ledger for every scope the branch touched.
- **FR-005**: `verify` MUST run deck steps only when the deck scope is touched and package tests only when the package scope is touched, and everything on pushes to main.
- **FR-006**: The repository MUST name an owner for `.github/` and `.understand-gate/`.
- **FR-007**: After merge, the presenter MUST add `understand-gate` to the required checks; the agent prepares the change.
- **FR-008**: The existing `human-gate` and `verify` checks MUST keep working.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A crafted pull request that edits the config and changes package code fails `understand-gate` (live, throwaway pull request).
- **SC-002**: A deck-only pull request runs 0 package tests; a package-only pull request runs 0 browser tests.
- **SC-003**: 0 steps in the `understand-gate` job install or run the pull request's code.

## Assumptions

- Owners in CODEOWNERS only block merges when the branch rule requires code-owner review, which a single-maintainer
  repository cannot use; the file documents ownership for later contributors.
- A same-named fake job in a pull request's own workflow is a residual gap; GitHub's documentation says same-named
  required checks must all pass, which is not verified for two Actions jobs (recorded as a known limit).
- Proof that a yes came from the human is Story 2.4.
