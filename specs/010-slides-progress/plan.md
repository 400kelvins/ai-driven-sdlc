# Implementation Plan: Slides Show the PR Workflow, Visual PRs, and the Package Roadmap

**Branch**: `010-slides-progress` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

## Summary

Four new slides go into `pages/talk.md`, and one existing slide is updated:

| # | Slide | Where |
|---|---|---|
| A | **Every change is a pull request**: a `Flow` with PR → tests 🔒 → AI review 💬 → slide changes 💬 → you 🔒 → merge. Caption: "Robots advise. Tests and I decide." | after "Gates with teeth" |
| B | **Review you can see**: the PR #6 slide 3 before/after images, side by side, plus "the AI review opens with a diagram" | after A |
| C | **When I said No**: Story 11, quiz passed, "No, I didn't understand", analogy + diagram → yes. Lesson: a quiz is not understanding. | after B |
| D | **Next: install it in your repo**: the package roadmap | before "Start on Monday" |
| ✏️ | **Gates with teeth**: the review card reads "enforced at ship + on GitHub", and the notes drop "Next step: enforce it in CI too" | existing |

The images are copied to `public/pr-demo/slide3-before.png` and `slide3-after.png`, which makes them offline-safe.

## Technical Context

- **Tools**: Slidev 53, the existing `Flow` component, Markdown. No new code or dependencies.
- **Testing**:
  - Existing: notes on every slide; the 20-minute budget (currently ~9.6 min).
  - New e2e: the four titles exist in order, and both images load from local files.
- **Constraints**: offline-safe; `behind.md` untouched (Story 8); no personal data.

## Constitution Check

| Principle | Status |
|---|---|
| I. No hand-written code | ✅ AI drafts the slides; the presenter may edit wording as `content:` |
| II. Spec is source of truth | ✅ Story 13, issue #4, spec 010 |
| III. Humans at the gates | ✅ three gates; the human merges |
| IV. Local-first | ✅ `npm run verify`, then PR, then ship |
| V. Simplicity | ✅ reuses `Flow`, plain images |
| VI. Offline-safe | ✅ images are local; no remote URLs on slides |

## Project Structure

```text
pages/talk.md                  # 4 new slides + 1 edit
public/pr-demo/                # slide3-before.png, slide3-after.png (from PR #6)
tests/progress.spec.ts         # titles in order, images load
```

## Complexity Tracking

No violations.
