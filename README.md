# Goodbye, Manual SDLC?

**Architecting the AI-Driven SDLC: What's Left for Humans?** Conference talk, October 2026.

This repository is both the talk and the demo. The slide deck is a live web app
([ai-driven-sdlc.vercel.app](https://ai-driven-sdlc.vercel.app)), and every feature in it was built
through an AI-driven lifecycle. The requirements were spoken, then turned into specs. AI wrote and
reviewed the code, and AI deployed it and checked the logs. A human approved or rejected the work at
the gates. The code has no hand-written lines. The slide wording and speaker notes belong to the
presenter.

> Say it. See it. Ship it. Humans at the gates, not the keystrokes.

## The lifecycle

```mermaid
flowchart LR
  W[Voice: Wispr Flow] --> B[BMad: PRD and Stories] --> S[spec-kit: spec, plan, tasks]
  S --> PG{{Plan gate}} --> I[Claude Code: implement] --> T[Playwright: agent tests]
  T --> CG{{Code gate}} --> R[AI code review, read aloud] --> RG{{Review gate}}
  RG -->|yes| V[Vercel: deploy + log check] --> RE[AI retrospective]
  PG -->|no| W
  CG -->|no| W
  RG -->|no| W
```

Humans review through three channels. They **read** short summaries, **listen** to reviews read
aloud with each word highlighted as it is spoken, and **see** tables and diagrams. Each gate produces
a [Gate Review Pack](templates/gate-review-pack.md) that combines all three.

## The three gates

| Gate | When | How it is enforced |
|---|---|---|
| Plan | Before `/speckit-implement` | Declared as a required hook in [`.specify/extensions.yml`](.specify/extensions.yml); spec-kit's implement skill instructs the agent to run [`/speckit-gate-plan`](.claude/skills/speckit-gate-plan/SKILL.md) and wait |
| Code | After implementation and tests | Same mechanism: [`/speckit-gate-implement`](.claude/skills/speckit-gate-implement/SKILL.md) |
| Review | After the AI code review | The decision is recorded with a fingerprint of everything that ships. The required `human-gate` PR check blocks the merge, and `npm run ship` refuses to deploy, if any shipped file has changed since the yes. |

Decisions are recorded in the [gate log](_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/gates.jsonl).
The plan and code gates are prompts that the agent follows. The review gate is enforced by
`npm run ship`, not by Vercel. The agent is instructed never to answer a gate itself, and the gate
log makes any decision visible in review.

## Pull requests

Every change reaches `main` through a pull request. Branch protection requires two checks, applies
them to administrators as well, and blocks direct pushes and force pushes:

| Check | Required | What it does |
|---|---|---|
| `verify` | yes | `npm run verify`: unit tests, end-to-end tests, build, and the speaker-notes leak check |
| `human-gate` | yes | `npm run gate:check` on the PR's head commit. It passes only when the latest review-gate decision is yes and matches the exact shipped code. |
| AI review | no | The [Claude GitHub Action](.github/workflows/claude-review.yml) posts an `## AI code review` comment. `npm run pr:review` pulls it into the review-gate pack. |

GitHub does not let authors approve their own pull requests, so the human approval is a CI check
backed by the gate log rather than a GitHub review. The flow is: open the PR, the AI reviews it,
you read and hear the review pack, say yes, push the `docs:` gate commit, `human-gate` turns green,
and you merge. Merging does not deploy. `npm run ship` on `main` does. See [the CI workflow](.github/workflows/ci.yml).
The protection settings are kept in [`.github/branch-protection.json`](.github/branch-protection.json)
and applied with `npm run protect:main`. Branches must be up to date before merging, so the merged
code is exactly the code that was approved.

**Limit, stated plainly:** this is a one-person repository, and the agent works with the owner's
GitHub login. Anyone with write access could append a "yes" to the gate log. The controls against
that are the agent's rules (never record a decision the human did not give, and never merge), the
public gate log that shows every decision, and the merge button, which only the human presses. A
team would add a second reviewer with CODEOWNERS.

## Where everything is

| Artifact | Location |
|---|---|
| PRD, decision log, research | [`_bmad-output/.../prd-ai-driven-sdlc/`](_bmad-output/initiative-ai-driven-sdlc/prd-ai-driven-sdlc/prd-ai-driven-sdlc.md) |
| Epic and Stories (BMad) | [`epic-keynote-deck.md`](_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/epic-keynote-deck.md), [`tickets.toml`](_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml) |
| Specs (spec-kit) | [`specs/`](specs/) |
| Constitution | [`.specify/memory/constitution.md`](.specify/memory/constitution.md) |
| Gate Review Packs | [`epic-keynote-deck/gates/`](_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/gates/) and `story-*-gate-review.md` |
| Gate skills | [`.claude/skills/speckit-gate/`](.claude/skills/speckit-gate/SKILL.md) |
| Slides | [`slides.md`](slides.md), [`pages/`](pages/) |

**Spec-kit coverage:** Story 1 ran every `/speckit-*` command before the gates existed. Story 7 is
the first to run every command with all three gates recorded in the gate log. Stories 2–6 have specs
in spec-kit's format, but they were implemented without `/speckit-implement`, so no hooks fired for
them. The retrospective covers this.

## Run it

Requires Node 22 and npm. Presenting needs macOS for the read-aloud feature.

```sh
npm install && npx playwright install chromium
npm run dev               # http://localhost:3030 — presenter view at /presenter
```

Keys: ← → ↑ ↓ to navigate, **M** to jump to live monitoring and back.

| Command | What it does |
|---|---|
| `npm run verify` | Unit tests, end-to-end tests, build, and the speaker-notes leak check |
| `npm run ship` | `verify`, then the review gate check, then deploy to Vercel |
| `npm run review:speak -- <pack.md> --highlight` | Reads a Gate Review Pack aloud and highlights each word in iTerm or Terminal |
| `npm run gate:record -- --stage <plan\|implement\|review> --story <id> --decision <yes\|no>` | Records a human decision |
| `npm run qr` | Regenerates the QR codes on the links slide |
| `npm run pr:review` | Prints the AI review comment on the current branch's pull request |

## Tools

[Claude Code](https://claude.com/claude-code) ·
[GitHub spec-kit](https://github.com/github/spec-kit) ·
[BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) ·
[Wispr Flow](https://wisprflow.ai) · [Slidev](https://sli.dev) ·
[Playwright](https://playwright.dev) · [Vercel](https://vercel.com)

## License

Copyright 2026 400kelvins. Licensed under the [Apache License 2.0](LICENSE).
