# Tasks: Release Script and read-listen-see Alias

**Input**: [spec.md](spec.md), [plan.md](plan.md)

## Phase 1: Setup

- [x] T001 Publishing fields in `packages/understand-gate/package.json`; `LICENSE` copy; `release` script entry
- [x] T002 `packages/read-listen-see/` (package.json, bin, README, LICENSE); `npm install` links it; package scope covers it

## Phase 2: User Story 1 — prepare (P1)

- [x] T003 [US1] Tests first in `packages/understand-gate/tests/release.test.mjs`: refuses dirty, not main, behind origin, bad bump; bumps both versions and the alias dependency on a release branch
- [x] T004 [US1] `packages/understand-gate/scripts/release.mjs` prepare

## Phase 3: User Story 2 — tag (P1)

- [x] T005 [US2] Tests first: refuses without package yes, existing tag, versions out of step; creates the tag and prints publish commands; the script source never runs publish or push
- [x] T006 [US2] tag in `release.mjs`

## Phase 4: User Story 3 — alias (P2)

- [x] T007 [US3] Test: `read-listen-see` gives the same output and exit code as `understand-gate`

## Phase 5: Polish

- [x] T008 README "Release"; `npm pack --dry-run` lists no tests
- [x] T009 `npm run verify` passes
- [ ] T010 Live: this PR is the first that needs the presenter's `/understand-gate yes` comment (Story 2.4 T011)
