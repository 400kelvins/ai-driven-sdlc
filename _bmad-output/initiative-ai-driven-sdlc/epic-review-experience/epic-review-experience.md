---
type: epic
title: "Hear, see, quiz: a review you understand before you say yes"
parent: initiative-ai-driven-sdlc
covers: [UG-FR-12, UG-FR-13, UG-FR-14, UG-FR-15, UG-FR-16, UG-FR-17, UG-FR-18, UG-FR-19, UG-FR-20, UG-FR-23, UG-FR-24, UG-FR-26]
after: [epic-install]
assignee: ""
risk: high
---

# Hear, see, quiz: a review you understand before you say yes

## Description

Every gate opens a review pack that is spoken aloud on macOS, Windows, or in the browser, shows a call diagram, the tasks, and a file-by-file walkthrough, then quizzes the developer. Yes is possible only after the quiz, a confidence rating, and an own-words explanation graded by a separate AI session; No is one action away at every step. PRs carry an advisory AI review and a diagram plus screenshots.

## Outcome

Developers approve only what they understand; the signal is CM-2's first-try pass rate staying below near-100% in the local stats.

## Requirements

Completed at this epic's inception. `UG-` = ids from the package PRD; text in its Features section.

## Done when

1. A review pack is read aloud with word highlight on macOS and Windows, and in the browser elsewhere.
2. Yes is refused until quiz, confidence, and explanation all pass; No works mid-quiz.
3. On No, nothing is pushed and the agent asks why.
4. Every PR in an installed repo gets an advisory AI review and a diagram, and screenshots when UI changed.
5. Agents cannot merge.

## Boundaries

The review flow and PR visuals as installed into a repo. Not the installer mechanics (epic-install), not onboarding (epic-onboarding).

## References

- parent — ../prd-sdlc-blueprint-package/prd-sdlc-blueprint-package.md, Features and NFRs
- constraint — ../architecture-sdlc-blueprint-package/architecture-sdlc-blueprint-package.md, AD-6, AD-7

## Notes

- Waits on epic-install because: packs, speakers, and skills ship through the installer.
