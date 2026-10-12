---
layout: center
---

# The AI-Driven SDLC

Same stages. Different depth of AI.

<!--
Let's start with where most teams are today, then where this deck was built.
-->

---

# The old SDLC

Linear, gated, a human at every step

<div class="mt-10">
<Flow :steps="['Requirements doc', 'Design doc', 'Code', 'Manual review', 'Manual test', 'Deploy', { label: 'hope 🤞', kind: 'muted' }]" />
</div>

<div class="mt-8 op-70">AI, where it exists: autocomplete, bolted on.</div>

<!--
Requirements doc, design doc, code, manual review, manual test, deploy, and hope.

Every arrow is a hand-off between people, and every box is someone typing.

AI shows up only as autocomplete inside the code box.
-->

---

# The new SDLC

The spec is the living source of truth

<div class="mt-10">
<Flow :steps="['🎙 Voice', 'Spec', { label: 'Gate', kind: 'gate' }, 'Plan and tasks', 'AI code', 'AI tests', 'AI review', { label: 'Gate', kind: 'gate' }, 'AI deploy', 'AI log check', { label: 'Gate', kind: 'gate' }, 'AI retro']" />
</div>

<div class="mt-8 op-70">Humans sit at decision points, not at every keystroke.</div>

<!--
Same stages, different depth of AI at each one.

The spec is the source of truth. AI is embedded at planning, design, code, review, test, and ops.

Even the prompts are AI-assisted: I speak with Wispr Flow instead of typing.

Humans sit at the gates. Point at the amber boxes.
-->

---
layout: center
---

# Humans read, listen, and see

<div class="grid grid-cols-3 gap-16 mt-12 text-3xl text-center">
  <div><div class="text-7xl mb-4">📄</div>Read<div class="text-base op-70 mt-2">short summaries</div></div>
  <div><div class="text-7xl mb-4">🔊</div>Listen<div class="text-base op-70 mt-2">reviews read aloud</div></div>
  <div><div class="text-7xl mb-4">📊</div>See<div class="text-base op-70 mt-2">tables, diagrams, charts</div></div>
</div>

<!--
This is the core idea of the talk.

We are slow at scanning a 2,000-line diff. We are fast at reading a short summary, hearing a review, and looking at a diagram.

So every stage of this lifecycle reports back in those three forms. That's what makes the human gate fast.
-->

---

# The pipeline behind this deck

<div class="mt-10">
<Flow :steps="['🎙 Wispr Flow', 'BMad<br/><small>PRD and Stories</small>', 'spec-kit<br/><small>spec · plan · tasks</small>', 'Claude Code<br/><small>implement</small>', 'Playwright<br/><small>agent tests</small>', 'AI review<br/><small>read aloud</small>', { label: 'Gate Review Pack', kind: 'gate' }, 'Vercel<br/><small>deploy + logs</small>']" />
</div>

<div class="mt-6 op-70">No at the gate → back to Wispr Flow and discovery.</div>

<!--
Here's the actual pipeline.

I speak into Wispr Flow. BMad turns it into a PRD and Stories. spec-kit turns each Story into a spec, a plan, and tasks. Claude Code implements. Playwright tests it. Another AI agent reviews the code and reads its findings aloud.

Everything lands in a Gate Review Pack. Yes ships to Vercel and checks the logs. No goes back to discovery.
-->

---

# Tools per stage

<div class="text-sm">

| Stage | Tool | Human gate |
|---|---|---|
| Requirements | Wispr Flow + BMad PRD | Approve the Stories |
| Estimation | AI: hours · points · tokens · $ | Accept the scope |
| Spec | GitHub spec-kit | — |
| Code | Claude Code | — |
| Test | Playwright, run by the agent | — |
| Review | AI code review, read aloud | Approve the Gate Review Pack |
| Deploy + logs | Vercel CLI | Approve the release |
| Retro | AI from git and usage | Agree the lessons |

</div>

<div class="op-70 mt-2">All fit a Claude subscription.</div>

<!--
One tool per stage, all of it works with a Claude subscription.

Notice the right column. The human doesn't disappear. The human moves to the gates.
-->

---

# The Gate Review Pack

What I actually look at before saying yes

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

- **Summary** — 3 to 5 sentences, read aloud
- **Table** — what was done, with evidence
- **Estimate vs actual** — hours, points, tokens, $
- **Diagram** — how it fits together
- **Review findings** — fixed, deferred, or ignored

</div>
<div>

<Flow :steps="['Pack', { label: 'Human', kind: 'gate' }, 'Next stage']" />

<div class="mt-4 op-70">or → back to discovery</div>

</div>
</div>

<!--
This is the artifact that replaces reading diffs.

Every Story ends with one. I can read it in a minute or listen to it while I make coffee.

Then I say yes or no. No sends the work back to discovery, not to a bug ticket.
-->

---

# Estimation, three ways

| Story | Estimate | Actual (agent time) |
|---|---|---|
| Deck scaffold + deploy | 0.5 h · 2 pts | ~6 min |
| Read-aloud review tool | 0.75 h · 2 pts | ~2 min |
| Presenter view + countdown | 1 h · 3 pts | ~3 min |
| Monitoring switch | 1 h · 3 pts | ~3 min |
| Demo video slide | 0.5 h · 2 pts | ~2 min |

<div class="mt-6 op-70">Plus tokens and dollars per Story. Full numbers in the retrospective.</div>

<!--
AI estimated every Story in hours, story points, tokens, and dollars before any work started.

The actuals are agent time from git timestamps. The gap is real, but be careful: it doesn't count my time at the gates, and that's where the real cost moved.
-->

---
layout: two-cols-header
---

# What the pipeline caught

::left::

### The bug
Hiding the presenter view still left my **speaker notes inside the public website's code**.

::right::

### Who caught it
Not a human. The AI agent checked the built site for note text before deploying.

<div class="mt-6">Fixed with one build flag. Verified live: 0 matches.</div>

<!--
A real example from this sprint.

I asked for the presenter view to be dev-only. It looked fine. But the notes were still shipped in the JavaScript bundle. Anyone could have read them.

The AI agent's verification step caught it before I ever noticed. That's the value of a verification gate that's automatic.
-->

---
layout: center
---

# What's left for humans?

<div class="grid grid-cols-2 gap-x-16 gap-y-6 mt-10 text-xl text-left">
  <div>🎯 <b>Intent</b> — what to build, and why</div>
  <div>⚖️ <b>Judgment</b> — yes or no at each gate</div>
  <div>✅ <b>Verification</b> — does this solve the problem?</div>
  <div>🗣 <b>Voice</b> — the words your users hear</div>
</div>

<!--
The title asked the question. Here's my answer.

Intent: deciding what's worth building. Judgment: yes or no at the gate. Verification: is this actually right, not just passing tests. And voice: I wrote my own speaker notes. The code is AI's; the words are mine.
-->

---

# The costs

| Finding | Source |
|---|---|
| Experienced developers were **19% slower** with AI, but believed they were **20% faster** | METR, 2025 |
| More AI adoption: throughput up, **delivery stability still down** | DORA, 2025 |
| High AI adoption: PR size **+154%**, review time **+91%** | Faros AI, 2025 |

<div class="mt-6 text-xl">AI moves the bottleneck to <b>verification</b>. Design for it.</div>

<!--
Now the honest part.

Review fatigue is real. You can feel faster without being faster. PRs get bigger and reviews take longer.

That's exactly why the gate matters, and why it has to be readable, listenable, and visual. If the human gate is a 2,000-line diff, you lose.
-->

---

# Start on Monday

1. **Speak** your next requirement instead of typing it
2. **Spec first**: one spec per Story, kept as the source of truth
3. **One gate per Story** with a summary, a table, and a diagram
4. **Let AI review**, and listen to the findings
5. **Measure** estimate vs actual, tokens and dollars included

<!--
You don't need the whole pipeline on day one.

Pick one Story next week. Speak it, spec it, give it one gate with a summary, a table, and a diagram. Measure it. The repo for this deck is public, so copy what you need.
-->

---
layout: center
---

# "Wow, I can do that much with AI.<br/>I thought I only had to prompt."

<!--
That's the line I want you to leave with.

Now let me show you the recording of one feature going from my voice to production.
-->
