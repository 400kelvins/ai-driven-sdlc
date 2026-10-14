# Research: Visual PRs (spec 009)

## R1. How to screenshot slides

- **Decision**: Use our own `scripts/slide-shots.mjs`. It drives Chromium through the existing `@playwright/test` against `slidev` dev:
  - opens each slide at `/<n>?clicks=999`, so the slide is fully revealed
  - waits for fonts and network idle
  - screenshots `#slide-content` at 1280×720 with animations disabled
- **Rationale**:
  - `slidev export --format png` needs a new `playwright-chromium` dependency. It failed locally: "please install it via `npm i -D playwright-chromium`".
  - Our own script reuses what CI already installs for `verify`.
- **Evidence**: A local prototype took two passes over 21 slides, about 24 s each, and **all 21 images were byte-identical** between the passes.
- **Alternatives**:
  - `slidev export` (new dependency)
  - `slidev build` plus a static server (an extra step, no gain)

## R2. How to detect "changed"

- **Decision**: Compare the base and head PNG of each slide number byte by byte.
  - Head-only slide → new.
  - Base-only slide → removed.
- **Rationale**:
  - Rendering is deterministic on one machine (R1), and base and head render on the same runner.
  - No pixel-diff library is needed.
- **Risk**: Inserting a slide in the middle shifts the numbers, so every later slide shows as changed. That is acceptable: the cap (R6) keeps the comment readable, and a shifted deck is a real change to review.
- **Alternatives**:
  - pixelmatch (new dependency, needs thresholds)
  - matching slides by title (titles repeat or are empty)

## R3. Where PR code runs and who holds the write token

- **Decision**: Two jobs.
  - **`shots`** has `contents: read` and `persist-credentials: false`. It runs `npm ci` and the deck for base and head, and uploads an artifact.
  - **`publish`** has `contents: write` and `pull-requests: write`. It never checks out or runs PR code. It checks out only the `pr-assets` branch, which only automation writes.
- **Rationale**: Same split as the Story 11 review/post jobs. A malicious PR can only affect a read-only job and an artifact, and the artifact is validated (R4).
- **Alternatives**:
  - `pull_request_target`: it runs with write access, so checking out PR code there is the classic "pwn request". Rejected.

## R4. Treating the artifact as untrusted

- **Decision**: `publish` accepts only:
  - files matching `^[0-9]{3}-(before|after)\.png$`, under 2 MB each, that start with the PNG signature
  - a manifest where `changes[]` contains `{slide: integer 1..999, kind: changed|new|removed}`, `total` is an integer, and `baseMissing` is a boolean
  - anything else fails with "invalid artifact" and nothing is published
- **Rationale**: The comment is assembled from validated integers and fixed words, so no PR-controlled text reaches the comment.

## R5. Image URLs

- **Decision**: `https://raw.githubusercontent.com/<owner>/<repo>/pr-assets/pr-<n>/<sha>/<NNN>-<before|after>.png`.
- **Rationale**: The repo is public, so GitHub's image proxy serves them inline. A folder per head SHA means an updated comment never shows stale cached images.
- **Alternatives**:
  - artifact links (not inline)
  - committing images to the PR branch (pollutes `main`; the presenter rejected this)

## R6. Comment shape and size

- **Decision**: Marker `## Slide changes`, then:
  - `_Commit <sha7>, N slides changed._`
  - a table of up to 10 rows: `Slide | Before | After` (`—` for a missing side)
  - "+K more changed" if over the cap
  - "No slide changed" when empty
- The comment is updated in place, the same way as the AI review.

## R7. Base cannot be built

- **Decision**: The base deck start is `continue-on-error`. If it has no shots, `baseMissing: true`, every head slide is listed as `new`, and the comment says "Before images missing: the base did not build".

## R8. Concurrent pushes to `pr-assets`

- **Decision**: `git pull --rebase` and push, retried up to 3 times. Folders are unique per PR and SHA, so rebases never conflict. The concurrency group is per PR, and superseded runs are cancelled.

## R9. Diagram in the AI review

- **Decision**: The review prompt requires, at the very top, a fenced `mermaid` flowchart of the change: the parts it touches and how they connect, with no more than 15 nodes. If the change is trivial, it is a one-node diagram.
- **Rationale**: GitHub renders Mermaid inline. A broken diagram shows as a code block, and the findings below it are still readable (spec US2 scenario 2).

## R10. Forks

- **Decision**: `shots` is skipped for forks with a `::warning::` and a step-summary note, the same pattern as the AI review. A fork's token cannot write, so there is nothing to publish.
