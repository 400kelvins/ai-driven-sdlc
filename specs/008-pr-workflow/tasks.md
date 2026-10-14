# Tasks: PR Workflow with AI Review and a Human Gate Check

**Input**: `specs/008-pr-workflow/` (plan, spec, research, data-model, contracts/, quickstart)
**Tests**: Requested by the Story verify line (a PR cannot merge without green checks and a matching yes).

## Phase 1: Setup

- [ ] T001 Add script `pr:review` (`node scripts/pr-review.mjs`) in package.json

## Phase 2: Foundational

- [ ] T002 Human: run `gh auth refresh -h github.com -s workflow` (R8) — blocks the first push only

## Phase 3: User Story 1 — Checks and a human yes before merge (P1) 🎯 MVP

**Goal**: `verify` and `human-gate` run on every PR and are required on `main`.
**Independent Test**: This PR shows `human-gate` red before the review yes and green after.

- [ ] T003 [P] [US1] Write unit test: ci.yml has jobs `verify` and `human-gate`; triggers on PR and push to `main`; `human-gate` checks out the PR head sha; every `uses:` pinned to an exact version; default permissions `contents: read`, in tests/unit/workflows.test.mjs
- [ ] T004 [US1] Write CI workflow per contracts/ci-checks.md: `verify` (checkout v7.0.1, setup-node v7.0.0 Node 22 with npm cache, `npm ci`, `npx playwright install --with-deps chromium`, `npm run verify`) and `human-gate` (checkout head sha with full history, setup-node, `npm ci`, `npm run gate:check`), in .github/workflows/ci.yml

## Phase 4: User Story 2 — AI review on every PR, in the gate pack (P1)

**Goal**: An `## AI code review` comment on each PR; the review gate pack includes it.
**Independent Test**: `npm run pr:review` prints this PR's AI review comment.

- [ ] T005 [P] [US2] Write unit test: `latestReview` returns the newest comment starting `## AI code review`, `null` when none, ignores other comments, in tests/unit/pr-review.test.mjs
- [ ] T006 [P] [US2] Extend tests/unit/workflows.test.mjs: claude-review.yml uses `anthropics/claude-code-action@v1.0.237`, token only via `secrets.CLAUDE_CODE_OAUTH_TOKEN`, a fork guard, a missing-secret skip, and is not named `verify` or `human-gate`
- [ ] T007 [US2] Implement scripts/pr-review.mjs per contracts/pr-review-cli.md (`gh pr view [n] --json number,url,comments`)
- [ ] T008 [US2] Write AI review workflow: triggers opened/synchronize/reopened/ready_for_review; same-repo guard; secret check step; review prompt (constitution rules, spec traceability, tests, secrets, severity tags 🔴🟡🔵, single comment starting `## AI code review` via `gh pr comment --edit-last` fallback to new), `github_token`, permissions `contents: read, pull-requests: write`, in .github/workflows/claude-review.yml
- [ ] T009 [US2] Update review stage to run `npm run pr:review` and include its output under "AI review on the PR" in .claude/skills/speckit-gate/SKILL.md

## Phase 5: Polish & docs

- [ ] T010 [P] Add "Pull requests" section (required checks, AI review, how a yes unblocks a PR, protection) to README.md
- [ ] T011 Amend constitution to v1.3.0 via `/speckit-constitution`: workflow adds "PR into main with required `verify` + `human-gate`"; Principle I notes `content:` edits arrive by PR, in .specify/memory/constitution.md
- [ ] T012 Run `npm run verify` and `npm run check:public main`; both pass

## Phase 6: Live (after the implement gate; outward-facing)

- [ ] T013 Human: run `claude setup-token`, then `gh secret set CLAUDE_CODE_OAUTH_TOKEN`
- [ ] T014 Push branch; open PR "Story 11: PR workflow" with `Closes #1`; confirm `verify` ✅ and `human-gate` ❌ (no yes yet)
- [ ] T015 Apply branch protection on `main` per research R9 (`gh api -X PUT .../branches/main/protection`); confirm a direct push to `main` is rejected
- [ ] T016 Confirm the AI review comment appears; review gate runs with `npm run pr:review` in its pack
- [ ] T017 After review yes: push the `docs:` gate commit; confirm `human-gate` ✅; human merges; issue #1 closes
- [ ] T018 On `main`: `npm run ship` and the deploy log pack

## Dependencies

T001 → T007. T003 → T004; T005 → T007; T006 → T008. T002 and T013 are human steps and block T014.
Phase 6 runs only after the plan and implement gates.

## Parallel

T003, T005, T006, T010 touch different files and can run together.

## Strategy

MVP = US1 (required checks plus protection). US2 adds the advisory AI review. This Story's own PR is
the end-to-end test.
