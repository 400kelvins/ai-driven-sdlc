# Feature Specification: Package Workspace and Per-Scope Fingerprints

**Feature Branch**: `011-package-scopes`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "please start" — Story 2.1 of epic `epic-gate-core` (GitHub issue #10).

**Traceability**: BMad Story 2.1 in `_bmad-output/initiative-ai-driven-sdlc/epic-gate-core/tickets.toml`;
GitHub issue [#10](https://github.com/400kelvins/ai-driven-sdlc/issues/10); architecture AD-3; package PRD
FR-21.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The deck and the package have separate fingerprints (Priority: P1)

The presenter keeps the deck and the new package in one repository. Each area is a named scope with
its own fingerprint, so a yes on a slide change will later not cover package code, and the reverse.

**Why this priority**: Separate approvals per area are the foundation for every later gate story.

**Independent Test**: In a repository with both areas, change one slide: the deck fingerprint changes
and the package fingerprint does not. Change one package file: the reverse.

**Acceptance Scenarios**:

1. **Given** a clean repository, **When** a slide changes, **Then** only the `deck` fingerprint changes.
2. **Given** a clean repository, **When** a package file changes, **Then** only the `package`
   fingerprint changes.
3. **Given** a planning document or gate record changes, **Then** no fingerprint changes.
4. **Given** an uncommitted or new file inside a scope, **Then** that scope's fingerprint changes.

---

### User Story 2 - The package exists as its own workspace with a command (Priority: P1)

The repository holds the package in its own folder with its own command, so it can be tested and
later released apart from the deck.

**Independent Test**: The command prints a scope's fingerprint; asking for an unknown scope fails
with a one-line reason; the package's tests run as part of the repository's checks.

**Acceptance Scenarios**:

1. **Given** the repository, **When** the presenter runs the command for the `deck` scope, **Then** it
   prints a 16-character fingerprint and exits 0.
2. **Given** an unknown scope name, **Then** the command exits 1 and names the scope and the known
   scopes.
3. **Given** a missing or invalid scope configuration, **Then** the command exits 1 with a one-line reason.
4. **Given** no scope is named, **Then** the command exits 2 with its usage.

### Edge Cases

- A file matching no scope (for example a planning document) belongs to no scope.
- A file may belong to more than one scope if the configuration says so; each fingerprint covers it.
- Deleted files inside a scope change its fingerprint.
- The existing whole-repository gate keeps working unchanged until Story 2.6.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST hold the package in its own workspace folder, `packages/understand-gate`.
- **FR-002**: A single committed configuration file MUST name the scopes and, for each, the files it
  includes and excludes.
- **FR-003**: This repository's configuration MUST define a `deck` scope (everything that ships with
  the deck today) and a `package` scope (the package folder).
- **FR-004**: The command MUST print a scope's fingerprint, covering the committed files in that scope
  plus uncommitted, new, and deleted files in it.
- **FR-005**: Files outside a scope MUST NOT change its fingerprint.
- **FR-006**: Errors MUST be one line on standard error; exit 0 pass, 1 failure, 2 usage.
- **FR-007**: The package's tests MUST run in the repository's existing verification.
- **FR-008**: The existing gate record, check, and ship behaviour MUST stay unchanged.
- **FR-009**: The package MUST have no runtime dependencies.

### Key Entities

- **Scope**: name, include patterns, exclude patterns.
- **Fingerprint**: a short hash identifying the exact contents of one scope.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A slide change moves 1 of the 2 fingerprints; a package change moves the other one.
- **SC-002**: A planning-document change moves 0 fingerprints.
- **SC-003**: The existing gate check still passes on this branch with the same command as before.
- **SC-004**: Every acceptance scenario is covered by an automated test.

## Assumptions

- Scope patterns use gitignore-style rules: later patterns win and `!` re-includes, a widely known model.
- The deck scope reproduces today's rule: code, config, `slides.md` and `pages/*.md`, plus gate wiring.
- The ledger and per-scope checks are Story 2.2; CI wiring is Story 2.3.
