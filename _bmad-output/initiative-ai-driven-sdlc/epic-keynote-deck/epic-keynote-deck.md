---
type: epic
title: "AI-built Keynote-style deck for the AI-Driven SDLC talk"
parent: initiative-ai-driven-sdlc
covers: [FR-1, FR-2, FR-3, FR-4, FR-6, FR-7, FR-8, FR-9, FR-14, FR-15, FR-16, FR-17, FR-18, FR-19]
assignee: ""
risk: medium
---

# AI-built Keynote-style deck for the AI-Driven SDLC talk

## Description

The presenter gives a 20-minute conference talk on 2026-10-14 from a Slidev deck that behaves like Apple Keynote, built entirely by AI through the Voice-to-Story Pipeline. The deck carries the talk content, plays the embedded demo recording, can switch to a live monitoring view and back, shows the behind-the-scenes artifacts and the sprint retrospective, runs locally first, and is then published on GitHub and Vercel.

## Outcome

The presenter delivers the talk from this deck without a technical failure, and every feature in it traces to a Story, a Gate decision, and an AI review in the public repo (PRD SM-1, SM-2).

## Requirements

Source: PRD `prd-ai-driven-sdlc.md` §4, ids reused.

- FR-1: Arrow-key navigation; Presenter and Audience Views in sync.
- FR-2: Presenter View with notes, elapsed time, current time, 20-minute countdown.
- FR-3: Notes never on the Audience View.
- FR-19: Switch from slides to a live monitoring view and back to the same slide.
- FR-4: Gate Review Pack (summary, table, diagram, read-aloud) — one example per Stage type is enough (PRD §6.2).
- FR-6: Estimate in hours, story points, tokens, dollars inside the Gate Review Pack.
- FR-14: AI code review read aloud to the presenter.
- FR-15: Embedded demo recording plays inside the deck, offline.
- FR-7: Local-first, then deploy to Vercel.
- FR-8: Deploy-time log check reported in a Gate Review Pack.
- FR-16: Public GitHub repository.
- FR-17: Public Vercel URL, shown on a slide.
- FR-18: Behind-the-scenes slides.
- FR-9: Retrospective slide: features shipped, estimated vs actual time, total token/dollar cost, test type.

## Done when

1. `npm run dev` serves the deck locally; arrow keys navigate and the Presenter View shows notes, clock, elapsed time, and a 20-minute countdown, with notes absent from the Audience View.
2. The demo recording plays inside the deck with the network off.
3. The presenter can switch to the live monitoring view and return to the same slide.
4. The full 20-minute talk content, behind-the-scenes slides, and retrospective slide are present with speaker notes.
5. The repo is public on GitHub and the deck is live on Vercel, with the deploy-time log check reported.

## Boundaries

One owner (the presenter), one deck, one repo. Not a Keynote product for other speakers (PRD §5). Not continuous AI log monitoring.

## References

- parent — _bmad-output/initiative-ai-driven-sdlc/prd-ai-driven-sdlc/prd-ai-driven-sdlc.md, §4 Features, §6 MVP Scope
- addendum — _bmad-output/initiative-ai-driven-sdlc/prd-ai-driven-sdlc/addendum.md (talk description, slide 5/6 notes, tool research)

## Notes

- Decision: deck framework is Slidev (default proposed under 2-day deadline; presenter said "let's run it", 2026-10-12).
- Decision: one epic — one owner, one deck, one deploy target (2026-10-12).
- Decision: FR-10–FR-13 (voice capture, Stories, spec-kit, agent tests) are the process that builds this epic, not deck code; they are exercised by every entry rather than covered by one (2026-10-12).
- Open question: which agent tests Stories and reviews diffs (PRD §8 Q1).
- Decision: tracer bullet is entry 1 (local scaffold); it does not reach Vercel, following FR-7 local-first (2026-10-12).
- Decision: one file per deck section via Slidev `src:` imports so parallel entries never edit the same file (2026-10-12).
- Assumption: the refactor sweep (entry 10) may be dropped if the deadline is at risk; the retrospective (entry 9) excludes it.
- Decision: Gate 1 approved by presenter — 10 Stories, early Vercel deploy after entry 1 (2026-10-12).
- Decision: monitoring view = live Claude Code session; demo clip = compressed MP4 < 3 min in public/demo/; retro actuals = git timestamps + Claude Code usage (2026-10-12).
