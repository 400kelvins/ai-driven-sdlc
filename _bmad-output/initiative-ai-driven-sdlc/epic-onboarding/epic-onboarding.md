---
type: epic
title: "First ten minutes: tour, demo story, and intent to GitHub issue"
parent: initiative-ai-driven-sdlc
covers: [UG-FR-5, UG-FR-6, UG-FR-7, UG-FR-9, UG-FR-10]
after: [epic-review-experience]
assignee: ""
risk: medium
---

# First ten minutes: tour, demo story, and intent to GitHub issue

## Description

After install, the developer gets a guided tour, the presenter's walkthrough video, and a demo story that runs on a deletable branch through every gate. Then they state a feature by voice or typing and the agent creates a story as a GitHub issue after a one-time login.

## Outcome

A new developer reaches their first real story within ten minutes of install (PRD UJ-2).

## Requirements

Completed at this epic's inception. `UG-` = ids from the package PRD; text in its Features section.

## Done when

1. The tour explains why, BMad Method, spec-kit, and how the AI talks to them, and links the video.
2. The demo story passes every gate on a demo branch, which deletes cleanly.
3. A spoken or typed intent becomes a GitHub issue after one login.
4. A first-time user reaches UJ-1 step 3 within ten minutes in a timed run.

## Boundaries

Onboarding and intake. Not other trackers (OQ-2, deferred).

## References

- parent — ../prd-sdlc-blueprint-package/prd-sdlc-blueprint-package.md, Features and NFRs
- constraint — ../architecture-sdlc-blueprint-package/architecture-sdlc-blueprint-package.md, AD-6, AD-7

## Notes

- Waits on epic-review-experience because: the demo story passes through the real review.
