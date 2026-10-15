# Tasks: CI Runs the Checker and Config from Main, with Path Filters

**Input**: [spec.md](spec.md), [plan.md](plan.md)

## Phase 1: CLI

- [ ] T001 [US1] Tests first in `packages/understand-gate/tests/touched.test.mjs`: prints touched scopes from the base config; none for docs-only; usage without `--base`
- [ ] T002 [US1] Implement `touched` in `packages/understand-gate/bin/understand-gate.mjs` (shares the `check --base` code path)

## Phase 2: User Story 1 — check from main (P1)

- [ ] T003 [US1] `.github/workflows/understand-gate.yml` per plan.md
- [ ] T004 [US1] Structural test `tests/unit/understand-gate-workflow.test.mjs`: `pull_request_target`, `contents: read`, both checkouts `persist-credentials: false`, the only `run:` is the base checker, fork skip
- [ ] T005 [US1] `.github/branch-protection.json` adds `understand-gate`

## Phase 3: User Story 2 — dual record (P1)

- [ ] T006 [US2] Tests first in `tests/unit/gate-record.test.mjs` (temp repo): one old line + one ledger line per touched scope; nothing in the ledger when no scope is touched
- [ ] T007 [US2] `scripts/gate-record.mjs`; `package.json` `gate:record` points to it

## Phase 4: User Story 3 — path filters (P2)

- [ ] T008 [US3] `package.json` `test:deck`; `ci.yml` verify: `fetch-depth: 0`, `areas` step, conditional deck and package steps, all on push
- [ ] T009 [US3] Structural test: verify always reports; deck steps gated on deck; package step gated on package
- [ ] T010 [US3] `pr-visuals.yml` `paths-ignore`

## Phase 5: Polish

- [ ] T011 `.github/CODEOWNERS`; package README "In CI" section
- [ ] T012 `npm run verify` passes
- [ ] T013 After merge (presenter): apply branch protection; live throwaway PR proves SC-001 and SC-002; close it unmerged
