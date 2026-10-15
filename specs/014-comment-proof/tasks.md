# Tasks: Proof of a Human Yes, by Pull Request Comment

**Input**: [spec.md](spec.md), [plan.md](plan.md)

## Phase 1: User Story 1 — comment proof in the checker (P1)

- [ ] T001 [US1] Tests first in `packages/understand-gate/tests/proof.test.mjs`: matching line passes; other fingerprint, other scope, unlisted login, bot account fail; line inside a longer comment counts; no `--comments` under comment proof fails with the lines to post; no proof mode needs no comments; proof settings come from the base config
- [ ] T002 [US1] `packages/understand-gate/src/proof.mjs`; config validation for `proof` and `reviewers` in `src/scopes.mjs`; `--comments` in `check`
- [ ] T003 [US1] `.understand-gate/config.json`: `proof: comment`, `reviewers: [400kelvins]`

## Phase 2: User Story 2 — CI (P1)

- [ ] T004 [US2] `understand-gate.yml`: fetch comments, pass `--comments`; `pull-requests: read`
- [ ] T005 [US2] `.github/workflows/understand-gate-rerun.yml`
- [ ] T006 [US2] Structural tests in `tests/unit/workflows.test.mjs` for both

## Phase 3: User Story 3 — what to paste (P2)

- [ ] T007 [US3] `scripts/gate-record.mjs` prints the lines after a review yes; test
- [ ] T008 [US3] `.claude/skills/speckit-gate/SKILL.md` step 5

## Phase 4: Polish

- [ ] T009 README "Proof of a human yes"; epic notes record the decision
- [ ] T010 `npm run verify` passes
- [ ] T011 After merge: live proof on this repository (SC-001)
