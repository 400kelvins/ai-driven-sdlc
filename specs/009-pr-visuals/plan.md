# Implementation Plan: Visual PRs, a Diagram and Slide Screenshots on Every Pull Request

**Branch**: `009-pr-visuals` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/009-pr-visuals/spec.md`

## Summary

A new workflow, `pr-visuals.yml`, runs on every PR into `main`, in two jobs:

- **`shots`** is read-only.
  - It checks out the PR's base and head and starts each deck.
  - `scripts/slide-shots.mjs` screenshots every slide.
  - `scripts/slide-diff.mjs` compares the two sets byte by byte and writes a manifest of the changed, new, and removed slides, plus only those images, as an artifact.
- **`publish`** checks out no PR code. It holds the only write token.
  - It validates the artifact: PNG files with numeric names, and a manifest of integers and fixed words.
  - It commits the images to the `pr-assets` branch under `pr-<n>/<head-sha>/`.
  - It posts or updates one `## Slide changes` comment, built only from validated numbers.

The AI review prompt now requires a Mermaid diagram before the findings. `scripts/pr-review.mjs` prints the slide comment as well as the AI review for the Gate Review Pack.

## Technical Context

**Language/Version**: Node 22 (ESM scripts), GitHub Actions YAML

**Primary Dependencies**: The existing `@playwright/test` (Chromium) and `@slidev/cli`. No new dependencies. Actions are the same pinned SHAs as Story 11.

**Storage**: The `pr-assets` branch, an orphan with images only. Comments on the PR.

**Testing**:
- `node:test` unit tests for the diff and manifest logic, the comment parser, and the workflow shape.
- A live check on this Story's own PR, which changes no slide and so must show "No slide changed".
- A throwaway PR that edits one slide's wording to confirm the before/after pair. It is closed without merging.

**Target Platform**: GitHub `ubuntu-latest`; macOS locally

**Project Type**: Repository automation for a static Slidev site

**Performance Goals**: The comment appears within 10 minutes (SC-002). Measured locally, one full screenshot pass of 21 slides takes about 25 seconds.

**Constraints**:
- PR code never runs with a write token.
- The model gains no write access.
- No image files reach `main`.
- The comment body contains no text taken from PR files.

**Scale/Scope**: 21 slides, one workflow, two scripts, one script edit, one prompt edit

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. No hand-written code | All code is written by the agent | ✅ |
| II. Spec is source of truth | Traces to Story 12, issue #3, spec 009 | ✅ |
| III. Humans at the gates | All three gates. Merge stays the human's. The new check is advisory and never replaces `human-gate`. | ✅ |
| IV. Local-first, then deploy | Scripts run locally against `npm run dev`. No deploy change. | ✅ |
| V. Simplicity under deadline | Reuses Playwright and the dev server. Byte compare instead of a pixel-diff library. No new dependency. | ✅ |
| VI. Offline-safe on stage | No change to slides or runtime | ✅ |

No amendment is needed. The constitution's PR step already covers advisory comments.

## Project Structure

### Documentation (this feature)

```text
specs/009-pr-visuals/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── slide-shots-cli.md
│   └── slide-changes-comment.md
└── tasks.md
```

### Source Code (repository root)

```text
.github/workflows/
├── pr-visuals.yml        # NEW: shots (read-only) → publish (no PR code, writes pr-assets + comment)
└── claude-review.yml     # prompt: Mermaid diagram first
scripts/
├── slide-shots.mjs       # NEW: screenshot every slide of a running deck
├── slide-diff.mjs        # NEW: compare two shot folders → manifest.json + changed images
└── pr-review.mjs         # also prints the "## Slide changes" comment
tests/unit/
├── slide-diff.test.mjs   # NEW
├── pr-review.test.mjs    # slide comment cases
└── workflows.test.mjs    # pr-visuals permissions, no checkout in publish, fork skip
README.md                 # "Pull requests" section: slide changes + diagram
package.json              # "shots" script
```

**Structure Decision**: The existing layout. The new workflow and scripts are shipped code, so they are covered by the review-gate fingerprint.

## Complexity Tracking

No violations.
