<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0 (MINOR: Principle I scope clarified; human-owned content exception added)
- Modified principles: I. No Hand-Written Code — content/notes carved out for the presenter
- Added sections: none
- Removed sections: none
- Deferred TODOs: none
-->
# AI-Driven SDLC Deck Constitution

## Core Principles

### I. No Hand-Written Code (NON-NEGOTIABLE)
All application code and configuration in this repository MUST be produced by AI agents. The human
MAY speak or type intent, answer questions, and approve or reject at Gates, but MUST NOT author
code or configuration by hand.

**Human-owned content (exception)**: The presenter MAY edit slide wording and speaker notes in
`pages/*.md` by hand, locally. Such edits MUST stay within Markdown text and `<!-- -->` notes —
no Vue components, scripts, styles, or frontmatter changes. Content edits are committed with the
prefix `content:` so the git history separates human content from AI code.

Rationale: the talk claims an AI-built product with zero hand-written code; the repo is the proof.
The talk's words and notes stay in the presenter's own voice.

### II. Spec Is the Living Source of Truth
Every change MUST trace to a BMad Story in
`_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/tickets.toml` and, where coded, to a
spec-kit feature spec under `specs/`. Code that contradicts its spec MUST be fixed or the spec
amended first. Rationale: traceability is what the behind-the-scenes slides show.

### III. Humans at the Gates
Each Story MUST end with a Gate Review Pack: a short summary, a table, a diagram, and an optional
read-aloud. The human answers yes or no. Yes advances the Story; no returns the work to Discovery.
Rationale: humans decide best by reading, listening, and seeing, not by scanning diffs.

### IV. Local-First, Then Deploy
Every change MUST pass `npm run build` and play correctly under `npm run dev` before any Vercel
deploy. After each deploy, the agent MUST read the deployment logs and report health in a Gate
Review Pack. No continuous AI log monitoring. Rationale: stage safety and token cost.

### V. Simplicity Under Deadline
The talk is on 2026-10-14. Slidev built-ins MUST be preferred over custom code; custom components
are allowed only where a built-in cannot meet a requirement, and the reason MUST be stated in the
plan. Each deck section lives in its own file (Slidev `src:` imports) so parallel Stories never
edit the same file. Rationale: finish on time; avoid merge collisions.

### VI. Offline-Safe on Stage
Slides and the demo video MUST work with no network at runtime: assets bundled locally, no CDN
fonts or scripts required to render. Rationale: venue Wi-Fi is unreliable.

## Stage Constraints

- Stack: Slidev (Vue/Vite), Node 22, npm. Hosting: Vercel (static build).
- Presenter flow: arrow-key navigation; Presenter View with notes, clocks, 20-minute countdown.
- Media: demo video is one compressed MP4 under 3 minutes in `public/demo/`.

## Development Workflow & Gates

1. Discovery by voice (Wispr Flow) → BMad Story.
2. spec-kit: specify → plan → tasks → implement per Story.
3. AI agent tests the Story against its verify line.
4. AI code review; findings summarized and read aloud.
5. Gate Review Pack → human yes/no.
6. Local verification → Vercel deploy → deploy-log check.

## Governance

This constitution supersedes other practices in this repo. Amendments are made through
`/speckit-constitution`, recorded with a version bump (MAJOR: principle removed or redefined;
MINOR: principle or section added; PATCH: wording). Every plan's Constitution Check MUST confirm
Principles I–VI; any deviation MUST be justified in the plan's Complexity Tracking.

**Version**: 1.1.0 | **Ratified**: 2026-10-12 | **Last Amended**: 2026-10-12
