---
type: epic
title: "npx understand-gate installs into any GitHub repo"
parent: initiative-ai-driven-sdlc
covers: [UG-FR-1, UG-FR-2, UG-FR-3, UG-FR-4, UG-FR-8, UG-FR-11, UG-FR-25, UG-FR-28]
after: [epic-gate-core]
assignee: ""
risk: medium
---

# npx understand-gate installs into any GitHub repo

## Description

`npx understand-gate init` copies the gate core, CI workflows, skills for Claude Code and Codex, AGENTS.md, and a starter constitution into an existing repo, runs the pinned BMad Method and spec-kit installers, wires spec-kit gate hooks, and records every file in a manifest. Update and uninstall never touch a file the user edited.

## Outcome

A developer with an existing GitHub repo gets working gates in one command; the signal is a fresh sample repo passing its first human-gate PR after `init`.

## Requirements

Completed at this epic's inception. `UG-` = ids from the package PRD; text in its Features section.

## Done when

1. `init` on a sample Node repo and a sample Python repo leaves a repo whose first PR is blocked until a human yes.
2. Uninstall on an untouched install leaves `git status` clean against the pre-install commit.
3. An edited installed file is never overwritten or removed without a prompt.
4. Contract tests pass against spec-kit v1.0.13 and bmad-method 6.12.0.
5. Both Claude Code and Codex get the same skills.

## Boundaries

The installer and templates. Not the gate logic (epic-gate-core), not the review experience (epic-review-experience).

## References

- parent — ../prd-sdlc-blueprint-package/prd-sdlc-blueprint-package.md, Features and NFRs
- constraint — ../architecture-sdlc-blueprint-package/architecture-sdlc-blueprint-package.md, AD-1, AD-8, AD-9

## Notes

- Waits on epic-gate-core because: it copies the gate core and CI templates built there.
