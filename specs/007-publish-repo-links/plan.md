# Implementation Plan: Publish the Blueprint and Links Slide

**Branch**: `007-publish-repo-links` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/007-publish-repo-links/spec.md`

## Summary

Generate two QR codes as SVG files committed to `public/qr/` (offline by construction), show them on
the Links slide with addresses and notes, add a README and MIT LICENSE, publish only `main` as the
public repo `400kelvins/ai-driven-sdlc`, then ship through the review gate and record the deploy
log check in a Gate Review Pack.

## Technical Context

**Language/Version**: Node 22 ESM scripts; Slidev Markdown
**Primary Dependencies**: `qrcode@1.5.4` (generate, dev); `jsqr@1.4.0` + `pngjs@7.0.0` (decode in tests, dev)
**Storage**: N/A (SVGs committed under `public/qr/`)
**Testing**: Playwright: screenshot each rendered QR on the Links slide → decode with jsQR → assert URL; node:test for generator
**Target Platform**: Projector via presenter laptop; GitHub; Vercel
**Project Type**: Static deck + publishing
**Constraints**: Offline at runtime; publish `main` only; no personal email/secrets; repo name free (checked)
**Scale/Scope**: 2 links, 1 slide, README, LICENSE

## Constitution Check (v1.2.0)

| Principle | Check | Status |
|---|---|---|
| I. No hand-written code | AI-generated; QR SVGs produced by a script | ✅ |
| II. Spec as source of truth | Spec 007 ↔ BMad Story 7 | ✅ |
| III. Humans at the Gates | Plan gate (this plan) → implement → code gate → AI review → review gate → ship | ✅ |
| IV. Local-first | `npm run verify` before publish and ship; deploy log check after | ✅ |
| V. Simplicity | Static SVGs; no runtime QR library in the deck | ✅ |
| VI. Offline-safe | SVGs bundled in `public/` | ✅ |

**Ordering decision**: the public push happens **after** the review gate yes, not during implement,
because publishing is irreversible. Implement prepares everything locally; the push is the last task.

Post-design re-check: no change. ✅

## Project Structure

### Documentation (this feature)

```text
specs/007-publish-repo-links/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/links.md
└── checklists/requirements.md
```

### Source Code (repository root)

```text
scripts/make-qr.mjs        # generates public/qr/{deck,repo}.svg from contracts/links.md URLs
public/qr/deck.svg
public/qr/repo.svg
pages/links.md             # "Try It Yourself": two QR codes + addresses + notes
tests/links.spec.ts        # decode both QR codes from the rendered slide
tests/unit/make-qr.test.mjs
README.md                  # blueprint + run instructions + artifact map
LICENSE                    # MIT
package.json               # qr script; dev deps pinned
```

## Complexity Tracking

None.
