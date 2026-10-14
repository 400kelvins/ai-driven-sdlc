# Implementation Plan: PR Workflow with AI Review and a Human Gate Check

**Branch**: `008-pr-workflow` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/008-pr-workflow/spec.md`

## Summary

Every change to `main` arrives as a pull request. Two GitHub Actions jobs run on each PR: `verify`
(the existing `npm run verify`) and `human-gate` (the existing `npm run gate:check`, run against the
PR's head commit). Branch protection on `main` requires both, enforces them on administrators, and
rejects direct and force pushes. A third workflow runs the Claude GitHub Action to review the PR and
post one comment headed `## AI code review`. It is advisory and not a required check. A new
`scripts/pr-review.mjs` pulls that comment into the review-gate Gate Review Pack. This Story ships as
the repo's first PR and closes issue #1.

## Technical Context

**Language/Version**: Node 22 (ESM scripts), GitHub Actions YAML

**Primary Dependencies**: `actions/checkout@v7.0.1`, `actions/setup-node@v7.0.0`,
`anthropics/claude-code-action@v1.0.237` (each released at least 2 weeks before 2026-10-14); `gh` CLI

**Storage**: Existing gate ledger `gates.jsonl`; repository secret `CLAUDE_CODE_OAUTH_TOKEN`

**Testing**: `node:test` unit tests for the review-comment parser and the workflow files' required
shape; a live check on this Story's own PR (blocked → yes → green)

**Target Platform**: GitHub (`ubuntu-latest` runners); macOS locally

**Project Type**: Repository automation for a static Slidev site

**Performance Goals**: CI under 10 minutes (SC-004); AI review comment within 10 minutes (SC-003)

**Constraints**: No secrets in the repo; the AI review must never block a merge; recording a gate
decision must not change the shipped-code fingerprint

**Scale/Scope**: One repo, one human reviewer, about 3 workflow and script files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. No hand-written code | Workflows, scripts, and protection settings are written by the agent. The human adds the secret and grants the token scope; neither is code. | ✅ |
| II. Spec is source of truth | Traces to Story 11, issue #1, and spec 008 | ✅ |
| III. Humans at the gates | Strengthened: the review gate becomes a required GitHub check. All three gates run for this Story. | ✅ |
| IV. Local-first, then deploy | CI repeats `verify`; deploys stay manual through `npm run ship` after merge, and Vercel is not git-linked | ✅ |
| V. Simplicity under deadline | Reuses `verify` and `gate:check`; no new dependencies; one small script | ✅ |
| VI. Offline-safe on stage | No change to slides or runtime | ✅ |

**Constitution amendment (MINOR, v1.3.0)**: the workflow section gains "PR into `main` with
required `verify` and `human-gate` checks". Under Principle I, human `content:` edits now reach
`main` through a PR too. Made through `/speckit-constitution` during implementation.

## Project Structure

### Documentation (this feature)

```text
specs/008-pr-workflow/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ci-checks.md
│   └── pr-review-cli.md
└── tasks.md
```

### Source Code (repository root)

```text
.github/workflows/
├── ci.yml              # jobs: verify, human-gate (required checks)
└── claude-review.yml   # AI review on PR open/sync; advisory
scripts/
└── pr-review.mjs       # fetch the PR's "## AI code review" comment → markdown for the gate pack
tests/unit/
├── pr-review.test.mjs
└── workflows.test.mjs  # required job names, pinned versions, secret only via secrets.*, fork guard
.claude/skills/speckit-gate/SKILL.md   # review stage pulls in npm run pr:review
README.md                              # "Pull requests" section
package.json                           # "pr:review" script
```

**Structure Decision**: Existing single-project layout. Workflows go in `.github/workflows/`, and
helpers go in `scripts/` beside `gate.mjs`. `.github/workflows/*.yml` are not Markdown and not under
a docs folder, so `gate.mjs` already counts them as shipped code, and the review gate covers them.

## Complexity Tracking

No violations.
