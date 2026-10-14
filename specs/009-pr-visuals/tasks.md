# Tasks: Visual PRs, a Diagram and Slide Screenshots on Every Pull Request

**Input**: `specs/009-pr-visuals/` (plan, spec, research, data-model, contracts/, quickstart)
**Tests**: Requested by the Story verify line: exactly the changed slide is shown, "No slide changed" otherwise, and no images on main.

## Phase 1: Setup

- [ ] T001 Add the script `shots` (`node scripts/slide-shots.mjs`) in package.json

## Phase 2: User Story 1 — The reviewer sees exactly which slides changed (P1) 🎯 MVP

**Goal**: Base and head screenshots, compared, and a manifest of the changed, new, and removed slides.
**Independent Test**: Two shoots of the same code diff to `0 changed`; one wording edit diffs to `1 changed`.

- [ ] T002 [P] [US1] Write unit tests for `diff(baseFiles, headFiles)` in tests/unit/slide-diff.test.mjs:
  - identical → no changes
  - one differing → `changed`
  - head-only → `new`
  - base-only → `removed`
  - empty base → `baseMissing: true` and all `new`
  - output sorted by slide
  - the CLI copies only the listed images and writes a valid manifest
- [ ] T003 [US1] Implement scripts/slide-diff.mjs per contracts/slide-shots-cli.md and data-model.md. Use a pure `diff()` plus the CLI. Byte compare (R2).
- [ ] T004 [US1] Implement scripts/slide-shots.mjs per contracts/slide-shots-cli.md (R1):
  - Chromium from `@playwright/test`, viewport 1280×720, `reducedMotion: 'reduce'`
  - slide count from `__slidev__.nav.slides`
  - for each slide: `/<n>?clicks=999`, wait for `.slidev-page-<n>`, fonts, and network idle, then screenshot `#slide-content` with animations disabled
- [ ] T005 [US1] Verify locally per quickstart steps 1–3: shoot twice and get 0 changed, then a temporary wording edit gives 1 changed. Revert the edit.

## Phase 3: User Story 4 — No images on main, no write access for PR code (P1)

**Goal**: A workflow where PR code runs read-only and a separate job publishes.
**Independent Test**: The workflow shape tests pass. This PR's comment appears. `main` has no `pr-` paths.

- [ ] T006 [P] [US4] Extend tests/unit/workflows.test.mjs for pr-visuals.yml:
  - valid YAML
  - default `contents: read`
  - `shots` permissions `contents: read` only
  - `publish` needs `shots`, with permissions `contents: write` and `pull-requests: write`
  - `publish` checks out only `ref: pr-assets` and never the PR head
  - every action pinned by SHA with a version comment
  - `persist-credentials: false` on the PR checkouts
  - fork guard plus a `::warning::`
  - the artifact validation regex `^[0-9]{3}-(before|after)\.png$`
  - job names not `verify` or `human-gate`
- [ ] T007 [US4] Write .github/workflows/pr-visuals.yml per research R3–R8 and contracts/slide-changes-comment.md:
  - **`shots`**:
    - check out head into `head/` and base into `base/`
    - setup-node 22, `npm ci` in both
    - install the Playwright Chromium
    - start each deck in turn on its own port; the base start is `continue-on-error`
    - run head's `slide-shots.mjs` against each
    - run `slide-diff.mjs`
    - upload `out/` as the artifact
  - **`publish`**:
    - download the artifact and validate it (R4)
    - check out `pr-assets`, or create it as an orphan
    - copy the images to `pr-<n>/<sha>/`
    - commit as `github-actions[bot]` and push with rebase-retry ×3
    - build the comment with `jq` from the manifest only
    - post or update the comment with the `## Slide changes` marker
    - a failure path posts "Screenshots could not be made"

## Phase 4: User Story 2 — The AI review opens with a diagram (P1)

- [ ] T008 [P] [US2] Extend tests/unit/workflows.test.mjs: the claude-review.yml prompt requires a `mermaid` diagram before the findings
- [ ] T009 [US2] Update the review prompt in .github/workflows/claude-review.yml per R9

## Phase 5: User Story 3 — The gate pack shows the pictures (P2)

- [ ] T010 [P] [US3] Extend tests/unit/pr-review.test.mjs:
  - `latestComment(comments, marker)` works for both markers
  - `render` prints the AI review and the slide changes
  - non-bot slide comments are ignored
- [ ] T011 [US3] Update scripts/pr-review.mjs to print both the `## AI code review` and the `## Slide changes` comments. Keep the export of `latestReview` for compatibility.

## Phase 6: Polish & docs

- [ ] T012 [P] README "Pull requests" section: slide changes comment, diagram, and the `pr-assets` branch, in README.md
- [ ] T013 Run `npm run verify` and `npm run check:public main`; both pass

## Phase 7: Live (after the implement gate; outward-facing)

- [ ] T014 Push the branch; open a PR "Story 12: visual PRs" with `Closes #3`. Confirm the AI review shows a diagram and the slide comment says "No slide changed".
- [ ] T015 Open a throwaway PR (base `009-pr-visuals`, or main after the merge) that edits one slide's wording. Confirm one before/after pair inline, then close it without merging and delete its branch.
- [ ] T016 Review gate with `npm run pr:review` in the pack. After a yes, push the `docs:` gate commit and confirm `human-gate` ✅. The human merges.
- [ ] T017 On `main`: confirm no `pr-` paths, run `npm run ship`, and write the deploy log pack.

## Dependencies

- T002 → T003; T004 → T005; T003 and T004 → T007; T006 → T007; T008 → T009; T010 → T011.
- Phases 2–5 come before the implement gate. Phase 7 comes after it.
