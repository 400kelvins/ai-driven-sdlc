# Feature Specification: Ledger v2 and Check Every Touched Scope

**Feature Branch**: `012-ledger-v2`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "yes please" — Story 2.2 of epic `epic-gate-core` (GitHub issue #12).

**Traceability**: BMad Story 2.2 in `_bmad-output/initiative-ai-driven-sdlc/epic-gate-core/tickets.toml`;
GitHub issue [#12](https://github.com/400kelvins/ai-driven-sdlc/issues/12); architecture AD-3, AD-4;
package PRD FR-21, FR-22, CM-2.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record a decision per scope (Priority: P1)

The presenter says yes or no at a gate, and the decision is recorded for each area the change belongs
to, tied to that area's fingerprint, with the quiz result.

**Why this priority**: Every later check reads these records.

**Independent Test**: Record a review yes for `deck`; the gate log gains one line naming the scope,
stage, story, decision, fingerprint, and quiz result.

**Acceptance Scenarios**:

1. **Given** a clean repository, **When** a yes is recorded for `deck` and `package` together, **Then**
   the log gains one line per scope, each with that scope's fingerprint.
2. **Given** uncommitted changes in a scope, **When** a decision is recorded for it, **Then** recording
   is refused and the changed files are named, so the yes covers what CI will see.
3. **Given** an unknown stage, decision, scope, or a confidence outside 1–5, **Then** recording is refused
   with one line naming the problem.
4. **Given** earlier lines in the log, **When** a new decision is recorded, **Then** earlier lines are
   unchanged.

---

### User Story 2 - Check every area a change touches (Priority: P1)

Before merge, the check finds which areas a branch changed since it left the main line and passes only
if each of those areas has a latest review yes matching its current fingerprint.

**Why this priority**: This is what stops a deck-only yes from covering package code.

**Independent Test**: A branch changing a slide and a package file fails the check with a deck yes
only, and passes once the package also has a matching yes.

**Acceptance Scenarios**:

1. **Given** a branch touching only the deck, **When** the deck has a matching review yes, **Then** the
   check passes, whatever the package's state.
2. **Given** a branch touching both areas, **When** only one has a matching yes, **Then** the check fails
   and names the other.
3. **Given** a yes, **When** a file in that scope changes afterwards, **Then** the check fails and says
   the code changed since the yes.
4. **Given** the latest review decision for a scope is no, **Then** the check fails even if an older yes
   matches.
5. **Given** a branch that touches no scope (planning documents only), **Then** the check passes and
   says no scope was touched.
6. **Given** the check is asked to cover all scopes, **Then** every scope needs a matching yes.

---

### User Story 3 - See whether the quiz is too easy (Priority: P2)

The presenter sees, from the local log, how often the quiz was passed on the first try, how many
re-explanations were needed, and how many times they said no.

**Independent Test**: On a sample log, the stats show the first-try rate, re-explanations, and no count.

### Edge Cases

- A malformed line in the log fails the check and names the line number.
- The gate log itself never belongs to any scope, so recording a decision never changes a fingerprint.
- The old whole-repository gate keeps working unchanged until Story 2.6.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Decisions MUST be appended to `.understand-gate/gates.jsonl`, one line per scope, never
  rewriting earlier lines.
- **FR-002**: Each line MUST hold time, scope, stage, story, decision, fingerprint, proof (empty until
  Story 2.4), attempts, first try, confidence, and note.
- **FR-003**: Recording MUST be refused when the scope has uncommitted changes.
- **FR-004**: The check MUST find touched scopes from the files changed between the merge base with a
  given base branch and the current state, including both sides of a rename.
- **FR-005**: The check MUST pass only when every touched scope's latest review decision is yes and its
  fingerprint matches; otherwise it MUST name each failing scope and why.
- **FR-006**: The check MUST be able to cover all scopes instead of touched ones.
- **FR-007**: Stats MUST report first-try pass rate, re-explanations, and no count, from the log only.
- **FR-008**: The gate log MUST be outside every scope.
- **FR-009**: Exit codes and one-line errors follow Story 2.1 (0 pass, 1 fail, 2 usage).
- **FR-010**: The existing gate and its log MUST stay unchanged.

### Key Entities

- **Decision**: one line in the gate log for one scope.
- **Touched scope**: a scope with at least one changed file since the merge base.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A two-area change needs exactly 2 matching yes decisions to pass.
- **SC-002**: A planning-only change needs 0.
- **SC-003**: Every acceptance scenario is covered by an automated test.
- **SC-004**: No network access is used (NFR-1).

## Assumptions

- Only the `review` stage is enforced by the check; plan and implement decisions are recorded for the
  record and the stats.
- The base branch is given on the command line (CI passes `origin/main` in Story 2.3).
- Old decisions in the previous log are not migrated here; that is Story 2.6.
