# Tasks: Publish the Blueprint and Links Slide

**Input**: `specs/007-publish-repo-links/` (plan, spec, research, data-model, contracts/links.md, quickstart)
**Tests**: Requested by the Story verify line (QR codes decode to the right URLs).

## Phase 1: Setup

- [X] T001 Add dev dependencies `qrcode@1.5.4`, `jsqr@1.4.0`, `pngjs@7.0.0` and script `qr` (`node scripts/make-qr.mjs`) in package.json

## Phase 2: Foundational

- [X] T002 Create the single source of link URLs (`deck`, `repo` per contracts/links.md) in scripts/links.json

## Phase 3: User Story 1 — Scan and open (P1) 🎯 MVP

**Goal**: Links slide shows two scannable codes offline.
**Independent Test**: `tests/links.spec.ts` decodes both codes from the rendered slide.

- [X] T003 [P] [US1] Write unit test: generator produces SVG for each link in scripts/links.json, in tests/unit/make-qr.test.mjs
- [X] T004 [P] [US1] Write e2e test: on "Try It Yourself", screenshot each QR, decode with pngjs + jsQR, assert URL equals scripts/links.json; offline enforced, in tests/links.spec.ts
- [X] T005 [US1] Implement generator writing `public/qr/<id>.svg` (error correction M, margin 2) in scripts/make-qr.mjs
- [X] T006 [US1] Run `npm run qr`; commit public/qr/deck.svg and public/qr/repo.svg
- [X] T007 [US1] Build Links slide: title "Try It Yourself", two QR images (≥ quarter slide height) with labels and addresses, speaker notes, in pages/links.md

## Phase 4: User Story 2 — Copy the process (P1)

**Goal**: Front page explains the blueprint and links every artifact.
**Independent Test**: README links resolve to existing files.

- [X] T008 [P] [US2] Write README with pitch, lifecycle diagram, three gates, artifact map (PRD, Stories, specs, gate packs, gates.jsonl), run/verify/ship commands, in README.md
- [X] T009 [P] [US2] Add Apache-2.0 license (copyright 400kelvins) in LICENSE
- [X] T010 [US2] Write unit test: every relative link in README.md points to an existing path, in tests/unit/readme-links.test.mjs

## Phase 5: User Story 3 — Nothing private (P1)

- [X] T011 [US3] Add secret/email scan of `main` history (personal email, token patterns) as `npm run check:public` in scripts/check-public.mjs and package.json
- [X] T012 [US3] Run `npm run verify` and `npm run check:public`; both pass

## Phase 6: Gates and publish (irreversible steps last)

- [X] T013 Code gate (after_implement hook) → AI review → review gate (human yes required)
- [X] T014 [US2] After review yes: `gh repo create 400kelvins/ai-driven-sdlc --public --source . --remote origin`; `git push -u origin main` (main only); verify signed-out visibility
- [X] T015 [US4] `npm run ship`; `npx vercel inspect <url> --logs`; write deploy Gate Review Pack in _bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/gates/007-publish-repo-links-deploy.md

## Dependencies

T001 → T002 → (T003, T004 in parallel) → T005 → T006 → T007; T008, T009 in parallel with Phase 3; T010 after T008; T011 → T012 → T013 → T014 → T015.

## Implementation Strategy

MVP = Phase 3 (scannable Links slide). Publishing (T014) only after the human review gate.
