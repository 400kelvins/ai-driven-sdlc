---
type: epic
title: "understand-gate gate core, enforced on GitHub and used by this repo"
parent: initiative-ai-driven-sdlc
covers: [UG-FR-21, UG-FR-22, UG-FR-27, UG-CM-2]
after: []
assignee: ""
risk: high
---

# understand-gate gate core, enforced on GitHub and used by this repo

## Description

The gate logic moves out of `scripts/gate.mjs` into the `understand-gate` package in this repo. Decisions are recorded per scope in an append-only ledger, a human yes carries proof, CI checks every touched scope with the checker and config from `main`, and a release script prepares a version that the human publishes. At the end, this repo runs `understand-gate` on itself and `scripts/gate.mjs` is gone.

## Outcome

The presenter approves deck and package changes separately, and no pull request can merge or weaken its own gate without a human yes; the signal is `human-gate` blocking a crafted PR that drops a scope or forges a yes.

## Requirements

`UG-` = ids from the package PRD (the deck PRD reuses FR numbers).

- UG-FR-21: Every decision is recorded in a gate log, tied to a fingerprint of the exact code reviewed.
- UG-FR-22: Required CI check `human-gate` blocks a merge unless a recorded yes covers the PR's exact code.
- UG-FR-27: A yes counts only with proof it came from the human: PR comment from their account, or a signed commit.
- UG-CM-2: First-try quiz pass rate measured locally from the gate log.
- E2 (AD-3): Scopes; every touched scope needs a matching yes.
- E2 (AD-10): Release script stops before `npm publish`; this repo dogfoods.

## Done when

1. A PR touching only deck files needs only a `deck` yes; one touching package code also needs a `package` yes.
2. A crafted PR that edits `config.json` to drop a scope, or edits the gate core to always pass, fails `human-gate`.
3. A ledger yes without a matching PR comment (comment mode) fails `human-gate`.
4. `npm run release -w understand-gate` ends with a tag and no publish.
5. `scripts/gate.mjs` is removed and `npm run ship` passes using `understand-gate`.

## Boundaries

The gate core and its CI wiring, inside this repo. Not the installer into other repos (epic-install), not the review pack experience (epic-review-experience).

## References

- parent — ../prd-sdlc-blueprint-package/prd-sdlc-blueprint-package.md, F7, F8, Counter-metrics
- constraint — ../architecture-sdlc-blueprint-package/architecture-sdlc-blueprint-package.md, AD-2, AD-3, AD-4, AD-5, AD-7, AD-10
- existing code — scripts/gate.mjs, .github/workflows/ci.yml

## Notes

- Decision: four package epics in this order: gate core, install, review experience, onboarding (presenter, 2026-10-15).
- Decision: the presenter's first story (scopes, CI path filters, release script) is split into entries 1, 3 and 5 (presenter, 2026-10-15).
- Decision: old and new gates run side by side until entry 6 (architecture AD-10).
