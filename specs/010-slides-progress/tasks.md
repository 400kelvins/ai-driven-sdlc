# Tasks: Slides Show the PR Workflow, Visual PRs, and the Package Roadmap

**Input**: `specs/010-slides-progress/` (spec, plan)
**Tests**: The existing notes and time-budget tests, plus one new e2e test.

## Phase 1: Setup

- [X] T001 Copy the PR #6 slide 3 images (from `pr-assets/pr-6/b0ae807…`) to public/pr-demo/slide3-before.png and public/pr-demo/slide3-after.png

## Phase 2: Tests first

- [X] T002 [P] Write an e2e test: the titles "Every change is a pull request", "Review you can see", "When I said No", and "Next: install it in your repo" exist in that order, between "Gates with teeth" and "Start on Monday"; both images on "Review you can see" load (naturalWidth > 0); "Gates with teeth" notes do not contain "Next step", in tests/progress.spec.ts

## Phase 3: Slides (US1–US4)

- [X] T003 [US1] Add slide A "Every change is a pull request" after "Gates with teeth" in pages/talk.md
- [X] T004 [US1] Update "Gates with teeth": the review card says "enforced at ship + on GitHub", and the notes describe the required check, in pages/talk.md
- [X] T005 [US2] Add slide B "Review you can see" (two images, PR #6 label, diagram line) in pages/talk.md
- [X] T006 [US3] Add slide C "When I said No" in pages/talk.md
- [X] T007 [US4] Add slide D "Next: install it in your repo" before "Start on Monday" in pages/talk.md

## Phase 4: Verify

- [X] T008 Run `npm run verify` (notes on every slide, time ≤ 20 min, build); visually check slides A–D in screenshots; run `npm run check:public main`

## Phase 5: Live (after the implement gate)

- [X] T009 Open a PR with `Closes #4`. The slide changes comment shows the new slides and the edited one.
- [X] T010 Review gate. After a yes, push the gate commit. The human merges.
- [X] T011 On `main`: `npm run ship` and the deploy log pack
