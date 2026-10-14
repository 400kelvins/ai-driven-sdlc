# Tasks: Ledger v2 and Check Every Touched Scope

**Input**: [spec.md](spec.md), [plan.md](plan.md)

## Phase 1: Foundation

- [ ] T001 `packages/understand-gate/src/args.mjs`: shared `--flag value` parser; CLI usage lists fingerprint, record, check, stats
- [ ] T002 `src/scopes.mjs`: the ledger path is never in a scope; test in `tests/scopes.test.mjs`

## Phase 2: User Story 1 — record (P1)

- [ ] T003 [US1] Tests first in `tests/ledger.test.mjs`: one line per scope with its fingerprint; dirty scope refused naming files; bad stage/decision/scope/confidence refused in one line; earlier lines unchanged; malformed line reported with its number
- [ ] T004 [US1] Implement `src/ledger.mjs` and `record` in `bin/understand-gate.mjs`

## Phase 3: User Story 2 — check (P1)

- [ ] T005 [US2] Tests first in `tests/check.test.mjs`: deck-only branch passes with deck yes; both-scope branch fails naming the missing one, passes with both; change after yes fails; latest no wins; docs-only branch passes; `--all` needs every scope; rename touches both sides
- [ ] T006 [US2] Implement `src/touched.mjs` and `check`

## Phase 4: User Story 3 — stats (P2)

- [ ] T007 [US3] Tests first in `tests/stats.test.mjs` on a fixture ledger
- [ ] T008 [US3] Implement `stats`

## Phase 5: Polish

- [ ] T009 README: record, check, stats, the ledger line
- [ ] T010 `npm run verify` passes; old `gate:check` unchanged

## Dependencies

T001 → T002 → (T003 → T004) → (T005 → T006) → (T007 → T008) → T009 → T010
