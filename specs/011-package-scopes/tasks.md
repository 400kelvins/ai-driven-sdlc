# Tasks: Package Workspace and Per-Scope Fingerprints

**Input**: [spec.md](spec.md), [plan.md](plan.md)

## Phase 1: Setup

- [x] T001 Add `"workspaces": ["packages/*"]` to `package.json` and create `packages/understand-gate/package.json` (name `understand-gate`, `type: module`, `bin`, `engines.node >=20.12`, no dependencies)
- [x] T002 Add `.understand-gate/config.json` with the `deck` and `package` scopes from plan.md

## Phase 2: User Story 1 — separate fingerprints (P1)

- [x] T003 [P] [US1] Tests first in `packages/understand-gate/tests/scopes.test.mjs`: `*`, `**`, `!` re-include, last match wins, the deck rule on sample paths
- [x] T004 [US1] Implement `packages/understand-gate/src/scopes.mjs`: `loadConfig(cwd)`, `inScope(path, scope)`
- [x] T005 [P] [US1] Tests first in `packages/understand-gate/tests/fingerprint.test.mjs` on a temp git repo: slide change moves deck only; package change moves package only; doc change moves none; uncommitted, new, and deleted files count
- [x] T006 [US1] Implement `packages/understand-gate/src/fingerprint.mjs`: `fingerprint(scope, { cwd })`, 16 hex chars

## Phase 3: User Story 2 — command (P1)

- [x] T007 [P] [US2] Tests first in `packages/understand-gate/tests/cli.test.mjs`: exit 0 + 16 hex; unknown scope exit 1 naming known scopes; bad config exit 1; no scope exit 2
- [x] T008 [US2] Implement `packages/understand-gate/bin/understand-gate.mjs`

## Phase 4: Polish

- [x] T009 Root `test:unit` also runs `packages/*/tests/*.test.mjs`; `npm install` updates the lockfile with the workspace link
- [x] T010 `packages/understand-gate/README.md`: what it is, the command, the scope rules
- [x] T011 `npm run verify` passes; `npm run gate:check` behaves as before (FR-008)

## Dependencies

T001 → T002 → (T003 → T004) → (T005 → T006) → (T007 → T008) → T009 → T010 → T011
