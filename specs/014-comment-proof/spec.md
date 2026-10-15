# Feature Specification: Proof of a Human Yes, by Pull Request Comment

**Feature Branch**: `014-comment-proof`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "let's go with pr comments as yes" — Story 2.4 of epic `epic-gate-core` (GitHub issue #18).

**Traceability**: BMad Story 2.4 in `_bmad-output/initiative-ai-driven-sdlc/epic-gate-core/tickets.toml`;
GitHub issue [#18](https://github.com/400kelvins/ai-driven-sdlc/issues/18); architecture AD-5; package PRD FR-27.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - My yes shows on the pull request (Priority: P1)

After the presenter says yes at the review gate, they paste one line per area onto the pull request from
their own account. The required check passes only when each touched area has such a comment naming the
exact fingerprint the ledger records.

**Why this priority**: It puts the human's decision on the pull request, where anyone can see it.

**Independent Test**: A pull request with a recorded yes but no comment fails the check; after the presenter
posts the comment, the check runs again and passes.

**Acceptance Scenarios**:

1. **Given** a touched scope with a matching ledger yes and no comment, **Then** the check fails and says which comment to post.
2. **Given** the comment `/understand-gate yes <scope> <fingerprint>` from a listed reviewer, **Then** that scope passes.
3. **Given** the comment names another fingerprint or another scope, **Then** that scope still fails.
4. **Given** the comment comes from a login not in the reviewer list, or from a bot account, **Then** it does not count.
5. **Given** the code changes after the comment, **Then** the fingerprint changes and the old comment no longer counts.

---

### User Story 2 - Posting the comment re-runs the check (Priority: P1)

The presenter does not have to push again or press re-run: posting the comment starts the check again on
the pull request's latest commit.

**Independent Test**: Post the comment; within a minute the `understand-gate` check on the pull request reruns.

---

### User Story 3 - I am told exactly what to paste (Priority: P2)

Recording a review yes prints the comment lines to paste, one per touched area.

### Edge Cases

- A comment with extra text around the line still counts if the line itself matches exactly.
- An edited comment counts with its current text.
- A repository whose config sets no proof mode keeps working as before (no comment needed).
- Known limit, stated in the documentation: an agent holding the presenter's GitHub login could post the comment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The scope config MUST be able to require comment proof and list the reviewer logins; this repository requires it for `400kelvins`.
- **FR-002**: With comment proof, the check MUST pass a scope only when its latest review yes matches and a listed reviewer's comment contains the line `/understand-gate yes <scope> <fingerprint>` with that fingerprint.
- **FR-003**: Proof mode and reviewers MUST come from the config at the merge base, like the scopes.
- **FR-004**: Comments from bot accounts MUST NOT count.
- **FR-005**: Posting or editing a comment containing `/understand-gate yes` MUST re-run the check on the pull request's latest run, without running the pull request's code.
- **FR-006**: Recording a review yes MUST print the lines to paste.
- **FR-007**: The documentation MUST state that comment proof shows involvement but does not stop an agent holding the same login.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Live: a pull request with a ledger yes and no comment fails; after the presenter's comment it passes, with no new push.
- **SC-002**: Every acceptance scenario is covered by an automated test.

## Assumptions

- Signed-commit and bot-account proof are deferred (the presenter's choice, 2026-10-15).
- The old gate (`human-gate`) is unchanged; it is retired in Story 2.6.
