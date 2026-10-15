---
name: "demo"
description: "Live demo of the AI-driven SDLC in about 3 minutes: from one spoken request to requirement questions, a GitHub issue, a slide change, a pull request, a read-aloud review pack, a quiz, and the human gate. Use when the presenter types /demo <request> during the talk."
argument-hint: "<what to add, e.g. a thank-you slide with my QR code>"
user-invocable: true
disable-model-invocation: false
---

# Live demo: request → human gate

`$ARGUMENTS` is the presenter's request. The audience is watching. Keep every message to one or two
lines, run each step at once, and say which step you are on: **Step N/8 · name**. No subagents, no
extra checks beyond the ones below. The human decides; never answer a question or the gate yourself.

Scope guard: the change is **one slide** in `pages/talk.md`. If the request needs more, say so and
offer the closest one-slide version.

## Step 1/8 · Request
Repeat the request in one line.

## Step 2/8 · Requirement questions
One `AskUserQuestion` call with exactly two questions (header ≤ 12 chars):
- the slide's title and key line (offer 2 short options);
- where it goes (before "Start on Monday", before the closing slide, or after the title).

## Step 3/8 · Ticket
```
gh issue create --title "Demo: <title>" --body "<request>, from the live demo. Title: <title>. Key line: <line>. Position: <where>."
```
Show the issue URL.

## Step 4/8 · Implement
1. `git switch -c demo/<kebab-title> origin/main` (the working tree must be clean; if not, stop and say so).
2. Add the slide to `pages/talk.md` at the chosen place: `---`, `# <title>`, the key line in
   `<div class="mt-12 text-3xl text-center">…</div>`, and speaker notes `<!-- … -->` in the
   presenter's first person (2–3 short sentences). Use only local files; no remote images.
3. Check: `npx playwright test tests/content.spec.ts --reporter=line` (every slide has notes; talk
   time). If it fails, fix and run it again.
4. `git add pages/talk.md && git commit -m "content: <title> (live demo)"` with the attribution line.

## Step 5/8 · Pull request
```
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -q -u origin demo/<kebab-title>
gh pr create --base main --title "Demo: <title>" --body "Closes #<issue>

\`\`\`mermaid
flowchart LR
  R[request] --> Q[questions] --> I[issue] --> S[slide] --> P[this PR] --> G[human gate]
\`\`\`
"
```
Show the PR URL. Do not wait for CI.

## Step 6/8 · Voiceover
Write `_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/gates/demo-<kebab-title>.md` from
`templates/gate-review-pack.md` with `**Decision**: pending` and a `## Summary (read aloud)` of exactly
three plain sentences: what was asked, what changed and where, and that the PR is open. Then read it
aloud in the foreground so the room hears it:
```
npm run review:speak -- <pack> --highlight
```

## Step 7/8 · Quiz
One `AskUserQuestion`, header `Quiz`, one question about this change (for example where the slide
went, or what its key line says), three options. If the answer is wrong, re-explain in one line with
an analogy and ask once more.

## Step 8/8 · Human gate
One `AskUserQuestion`, header `Gate`: **Yes** (approve this exact change) or **No** (send it back).
- **Yes**: `npm run -s gate:record -- --stage review --story demo-<kebab-title> --decision yes --note "live demo"`,
  set `**Decision**:` in the pack, commit the pack and both ledgers, push. Say: "Recorded. Tied to
  this exact code. Merge is mine, later."
- **No**: `gh pr close <n> --comment "Presenter said No at the gate."`, then go back to Step 2 with
  the presenter's reason.

Finish with one line: the issue, the PR, and the gate decision. Then `git switch main` so the deck
being presented shows main again.
