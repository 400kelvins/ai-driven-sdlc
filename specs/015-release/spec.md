# Feature Specification: Release Script and read-listen-see Alias

**Feature Branch**: `015-release`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "merged, let's go" — Story 2.5 of epic `epic-gate-core` (GitHub issue #20).

**Traceability**: BMad Story 2.5 in `_bmad-output/initiative-ai-driven-sdlc/epic-gate-core/tickets.toml`;
GitHub issue [#20](https://github.com/400kelvins/ai-driven-sdlc/issues/20); architecture AD-10; PRD OQ-1.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prepare a version on a branch (Priority: P1)

The presenter asks for a patch, minor, or major release. A release branch is made that bumps both packages
to the same new version, so the bump goes through a pull request and the gates like any other change.

**Independent Test**: On a clean main, `prepare minor` creates `release/understand-gate-0.1.0` with both
packages at 0.1.0 and the alias depending on exactly 0.1.0.

**Acceptance Scenarios**:

1. **Given** uncommitted changes or a branch other than main, **Then** prepare refuses and says why.
2. **Given** main is behind origin, **Then** prepare refuses.
3. **Given** an unknown bump word, **Then** prepare refuses with the allowed words.

---

### User Story 2 - Tag a reviewed version, then stop (Priority: P1)

On main, after the release branch merges, the tag step checks everything the presenter would want before
publishing, creates the version tag, and stops. It prints the commands to publish; it never publishes.

**Independent Test**: On main with a package review yes for the exact code, `tag` creates
`understand-gate@0.1.0` and prints `npm publish` commands without running them.

**Acceptance Scenarios**:

1. **Given** no package review yes for the exact code, **Then** tag refuses and names the package scope.
2. **Given** the tag already exists, **Then** tag refuses.
3. **Given** the two package versions differ, or the alias does not depend on the same version, **Then** tag refuses.
4. **Given** package tests fail, **Then** tag refuses.
5. **Given** everything passes, **Then** the output lists the files npm would publish and the exact commands to run.

---

### User Story 3 - The alias works (Priority: P2)

`read-listen-see` behaves exactly like `understand-gate`: same commands, same output, same exit code.

### Edge Cases

- The published files include the command, the source, the README, and the license, and never the tests.
- The release step needs no network access except reading `origin/main`; it never pushes.
- The alias's files are added to the package scope, so later changes to it need a package yes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `prepare <patch|minor|major>` MUST only run on a clean main that matches origin/main, and MUST create a release branch bumping both packages together.
- **FR-002**: `tag` MUST check, on main: clean tree, versions in step, tag absent, package tests passing, and a latest package-scope review yes matching the current package fingerprint.
- **FR-003**: `tag` MUST create the annotated tag `understand-gate@<version>` and print the push and publish commands; it MUST NOT push or publish.
- **FR-004**: Both packages MUST declare what they publish, a license, and the repository.
- **FR-005**: The alias MUST pass its arguments, output, and exit code through unchanged.
- **FR-006**: The package scope MUST cover the alias.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 code paths in the release script run `npm publish` or `git push`.
- **SC-002**: Every acceptance scenario is covered by an automated test.
- **SC-003**: The published file list of understand-gate contains no test file.

## Assumptions

- The first release is 0.1.0 (`prepare minor` from 0.0.0).
- The presenter runs `npm login` and `npm publish` themselves (AD-10); no npm token is stored in GitHub.
- The changelog is the list of merged pull requests; no changelog file in this story.
