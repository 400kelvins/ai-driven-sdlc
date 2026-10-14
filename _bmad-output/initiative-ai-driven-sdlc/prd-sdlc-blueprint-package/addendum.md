# Addendum: AI-Driven SDLC Blueprint Package

## Landscape research (2026-10-14, subagent digest; items marked unverified were not confirmed)

### spec-kit
- Multi-agent through `specify init --integration <key>`. About 40 agents, including claude, codex (`.agents/skills`), copilot, gemini, cursor-agent, opencode, kiro-cli, and `generic`.
- Hooks: `.specify/extensions.yml` → `before_implement` / `after_implement`. With `optional: false`, the agent must run the hook and wait.
- Python CLI, installed with uv. MIT license. Flags are being renamed (`--ai` → `--integration`).

### BMad Method
- Stable v6.12 installs with `npx bmad-method install` (Node 20.12+, Python 3.10+, uv).
- V7 (alpha, expected 2026-10-16) installs with `npx skills add bmad-code-org/BMAD-METHOD`, as SKILL.md skills.
- MIT license. The trademark forbids "BMad" in a product name and any implied endorsement. "Compatible with BMad Method" is allowed.

### Cross-agent standards
- **AGENTS.md** (Linux Foundation AAIF): Codex, Cursor, Gemini CLI, Copilot, Zed, Amp, and others. Claude Code reads it only when no CLAUDE.md exists, so the usual workaround is `@AGENTS.md` in CLAUDE.md.
- **Agent Skills (SKILL.md)**: 30–40+ tools (exact list unverified).
- **Hooks differ per agent:**
  - Claude Code: mature.
  - Codex: `hooks.json`; needs a one-time trust review.
  - Gemini CLI: experimental and must be enabled.
  - Cursor: fails open on non-2 exit codes.
  - Copilot: unverified.
- Conclusion: local hooks can't be the enforcement point; the CI `human-gate` check is.

### Comparables
- **cc-sdd**: npx, multi-agent, Kiro-style specs. No human gates and no CI enforcement.
- **OpenSpec**: Node CLI for brownfield specs.
- **GZKit**: Python, formal quality gates and attestations.
- Gap: nothing combines BMad + spec-kit + spoken gate packs + a fingerprinted ledger + a required CI gate.

### Text to speech with word highlight
- macOS: `say --interactive` (used today).
- Windows: System.Speech `SpeakProgress` gives per-word events.
- Linux: espeak-ng word callbacks only through its C API (unverified).
- Cross-OS fallback: an HTML pack using the Web Speech API's `onboundary` event (unverified per browser).

### Bundling vs invoking the installers
- Both projects are MIT, so bundling is legal with notices kept.
- Recommended: invoke the pinned upstream installers and ship only our own gates, skills, and CI files.
- Spec-kit paths change between versions, so contract tests per supported version are needed.
