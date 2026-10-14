# Gate Review Pack — Plan gate: Story 13, slides show the progress

**Gate**: plan → implement | **Date**: 2026-10-14 | **Issue**: [#4](https://github.com/400kelvins/ai-driven-sdlc/issues/4) | **Decision**: yes (2026-10-14, presenter; quiz passed first try)

## Summary (read aloud)

This is your plan gate for story thirteen, the slides. Four new slides go into the talk, after Gates with teeth. The first shows that every change is now a pull request, where robots advise and only the tests and you can block. The second shows the real before and after pictures of slide three from pull request six. The third tells the moment you said no because you didn't understand. The fourth says what comes next: an installable package. The Gates with teeth slide stops calling CI a future step. Estimate: forty minutes, two story points.

## The four new slides

| # | Title | Shows |
|---|---|---|
| A | **Every change is a pull request** | PR → tests 🔒 → AI review 💬 → slide changes 💬 → **you** 🔒 → merge. "Robots advise. Tests and I decide." |
| B | **Review you can see** | Slide 3 **before \| after** from PR #6 (local images, offline-safe) + "the AI review opens with a diagram" |
| C | **When I said No** | Quiz passed → "No, I didn't understand" → analogy + diagram → yes. *A quiz is not understanding.* |
| D | **Next: install it in your repo** | One command, Claude Code + Codex, spoken and quizzed review, human gate in CI, no yes without understanding |

Plus ✏️ **Gates with teeth**: "enforced at ship **+ on GitHub**".

## Where they go

```
… Gate Review Pack → Gates with teeth → [A] → [B] → [C] → Estimation … What's left for humans? → The costs → [D] → Start on Monday → closing line
```

## Rules

- Speaker notes are drafted in **your voice**. You can rewrite them later as `content:` commits.
- Time budget: currently ~9.6 min of notes + 3 min demo. The 4 slides add about 2 min, so it **stays under 20**.
- `behind.md` (Story 8) is not touched.

## Estimate

| Measure | Estimate |
|---|---|
| Time | 40 min |
| Story points | 2 |
| Test type | e2e: titles in order, images load offline, no "next step" left; existing notes and time tests |
