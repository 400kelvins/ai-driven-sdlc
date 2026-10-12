# Addendum — AI-Driven SDLC

## Talk title and description (user-approved 2026-10-12, verbatim)

**Title:** Goodbye, Manual SDLC? Architecting the AI-Driven SDLC: What's Left for Humans?

**Description:**

> Say it. See it. Ship it. Humans at the gates, not the keystrokes.
>
> The traditional SDLC is linear and gated, with a human at every step: requirements doc, design doc, code, manual review, manual test, deploy, and hope. In most teams AI is still bolted on as autocomplete.
>
> In this talk, the slide deck itself is the demo. It is a live app on Vercel, and every feature in it was built through an AI-driven lifecycle. Requirements are spoken through Wispr Flow, specs are written with GitHub spec-kit, Claude Code builds and reviews the code, and AI agents deploy it, check production logs and run the retrospective.
>
> The key idea is that humans are good at reading, listening and seeing. So every stage reports back in diagrams, tables, charts and short summaries, and the human role moves from typing to deciding. We'll also look at the costs: review fatigue, and feeling faster without being faster.
>
> You'll leave with a working blueprint, the tools that fit a Claude subscription, and the realization that there's much more to AI than prompting.

## Talk narrative — user-supplied slide notes (verbatim)

**Slide 5. The old SDLC** — Linear, gated, human-in-the-loop at every step: requirements doc → design doc → code → manual review → manual test → deploy → hope. AI, where it exists, is bolted on as autocomplete only.

**Slide 6. The new AI-driven SDLC** — Spec is the living source of truth. AI is embedded at every stage — planning, design, code, review, test, ops — and even the prompts themselves are AI-assisted (voice-to-spec via Wispr Flow, not just typed). Humans sit at decision points and verification gates, not at every keystroke.
- Speaker note: sketch both flows side by side; same stages, different depth of AI involvement at each.

## Research digest (2026-10-11, web subagent; [V]=verified primary, [2nd]=secondary, [U]=uncertain)

- **spec-kit** [V] github.com/github/spec-kit — `uv tool install specify-cli`; `specify init <proj> --integration claude` → skills in `.claude/skills`. Flow: constitution → specify → plan → tasks → implement → converge. Extensions: `bug`, `assess` (go/needs-clarification/kill — requirements gate). Command names drift across versions → pin version for demo.
- **Code review** [V] `anthropics/claude-code-action@v1` (@claude mention or auto-review per PR). Subscription billing via `claude setup-token` → `CLAUDE_CODE_OAUTH_TOKEN` [2nd — verify].
- **Support/logs** [V] Sentry remote MCP (`mcp.sentry.dev/mcp`); Linear remote MCP; GitHub Issues via `gh`/GitHub MCP [U].
- **Vercel** [V] official MCP `mcp.vercel.com` (projects, deployments, deployment logs, deploy). Known issue: `get_runtime_logs` "No logs found" in Claude Code (community thread #35417) → fallback `vercel logs --json | jq`. Vercel recommends human confirmation (prompt-injection via logs) — natural demo gate.
- **Estimation / retro** — no established tool; likely custom skills (estimate from `tasks.md`; retro from git/PR/Sentry history). BMad `bmad-retrospective` exists locally.
- **Framing/critiques** — Böckeler (martinfowler.com): spec-first vs spec-anchored vs spec-as-source; spec-kit = spec-first, verbose. Critiques: "waterfall again", review fatigue, spec still just context. Data (cite originals): METR 19% slower/felt 20% faster; DORA 2024/2025 stability hit, ~24% high trust; Faros PR size +154%, review time +91%. Framing: AI shifts bottleneck to verification → supports "humans at gates".
- **Slide tooling** — Slidev (Markdown+Vue, Mermaid built-in, presenter mode, LLM-friendly) recommended; Marp simplest; reveal.js most flexible. None export editable PPTX.

## Review / test agent candidates (open question #1)

| Option | What it does | Fits |
|---|---|---|
| `anthropics/claude-code-action@v1` | Auto-reviews every PR in GitHub Actions; `@claude` mentions | PR review visible on GitHub |
| `/code-review` (Claude Code) | Reviews local diff, branch, or PR number | Branch diffs before PR |
| `bmad-code-review` | Parallel reviewers, triaged findings | Fits BMad flow |
| `bmad-qa-generate-e2e-tests` + browser agent | Generates and runs e2e tests of the Deck | Story testing |

Combination idea: `bmad-code-review` on branch → GitHub Action on PR → e2e skill tests Story. Any output can feed the read-aloud.

## Tooling (mentioned so far)
- Claude subscription–compatible tools; GitHub spec-kit; Wispr Flow (voice-to-spec); Vercel (demo app deploy).
