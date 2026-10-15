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
<Flow :steps="['🎙 Voice', 'Spec', 'Plan and tasks', { label: 'Plan gate', kind: 'gate' }, 'AI code', 'AI tests', { label: 'Code gate', kind: 'gate' }, 'AI review', { label: 'Review gate', kind: 'gate' }, 'AI deploy', 'AI log check', 'AI retro']" />
</div>

<div class="mt-8 op-70">Humans sit at decision points, not at every keystroke.</div>

<!--
Same stages, different depth of AI at each one.

The spec is the source of truth. AI is embedded at planning, design, code, review, test, and ops.

Even the prompts are AI-assisted: I speak with Wispr Flow instead of typing.

Humans sit at three gates in the build. Point at the amber boxes: the plan gate before any code, the code gate after implementation and tests, and the review gate after the AI code review.
-->

---

# Specs, not prompts

<div class="grid grid-cols-2 gap-10 mt-8">
<div class="p-5 rounded-lg border-2 border-gray-400/50">
<div class="text-xl font-bold mb-3">Prompting</div>
<div class="text-lg leading-loose op-80">
A chat you can't review<br/>
Lost when the window closes<br/>
Different answer every time<br/>
The AI guesses the rest
</div>
</div>
<div class="p-5 rounded-lg border-2 border-indigo-400/60 bg-indigo-500/10">
<div class="text-xl font-bold mb-3">Spec-driven</div>
<div class="text-lg leading-loose">
📄 One source of truth for people and agents<br/>
🔍 Reviewed <b>before</b> any code exists<br/>
🔁 Repeatable: same spec, same plan<br/>
🎯 Small, focused tasks for the AI<br/>
🧭 Traceable: idea → story → spec → PR → deploy
</div>
</div>
</div>

<!--
Why specs instead of prompts?

A prompt is a conversation. You can't review it, it's gone when the window closes, and the AI fills every gap with a guess.

A spec is a document. My team and the agent read the same thing. I can review it before a single line of code exists, which is the cheapest moment to catch a wrong idea. It gives the AI small, focused tasks. And everything traces back: from the idea, to the story, to the spec, to the pull request, to the deploy.
-->

---

# BMad for the PRD, spec-kit to build

<div class="grid grid-cols-2 gap-10 mt-10">
<div class="p-5 rounded-lg border-2 border-indigo-400/60 bg-indigo-500/10">
<div class="text-2xl font-bold">BMad Method</div>
<div class="op-70 mb-4">the <b>what</b> and the <b>why</b></div>
<div class="text-lg leading-loose">PRD · architecture<br/>epics · stories</div>
</div>
<div class="p-5 rounded-lg border-2 border-indigo-400/60 bg-indigo-500/10">
<div class="text-2xl font-bold">GitHub spec-kit</div>
<div class="op-70 mb-4">the <b>how</b></div>
<div class="text-lg leading-loose">spec · plan · tasks<br/>implement</div>
</div>
</div>

<div class="mt-10 text-xl text-center">🎙 Idea → <b>BMad</b> story → <b>spec-kit</b> spec → code, with a gate between each step</div>

<!--
Two tools, two jobs.

BMad Method does the product thinking: the PRD, the architecture, and the stories. It answers what we're building and why.

GitHub's spec-kit does the engineering: for each story, a spec, a plan, and a task list, and then the implementation. It answers how.

So an idea I speak becomes a BMad story, the story becomes a spec-kit spec, and the spec becomes code. And between each step, there's a gate.
-->

---

# What is a gate?

<div class="mt-6 text-2xl text-center">The point where <b>I show I understand</b>, before the work moves on.</div>

<div class="grid grid-cols-3 gap-6 mt-10 text-center">
  <div class="p-4 rounded-lg border-2 border-amber-500 bg-amber-500/15"><b>Plan gate</b><div class="mt-2">Do I understand what will be built?</div></div>
  <div class="p-4 rounded-lg border-2 border-amber-500 bg-amber-500/15"><b>Code gate</b><div class="mt-2">Do I understand what was built?</div></div>
  <div class="p-4 rounded-lg border-2 border-amber-500 bg-amber-500/15"><b>Review gate</b><div class="mt-2">Do I understand the exact code that ships?</div></div>
</div>

<div class="mt-10 text-xl text-center">I hear it · I see it · a quiz checks me → <b>yes</b> or <b>no</b></div>
<div class="mt-3 text-lg text-center op-70">No sends it back. Yes is tied to the exact code.</div>

<!--
This is the most important idea in the talk.

A gate is not a button I click. It's the point where I show I understand, before the work moves on.

There are three. At the plan gate: do I understand what will be built? At the code gate: do I understand what was built? At the review gate: do I understand the exact code that's going to ship?

At every gate, the AI reads me a summary, shows me a diagram, and quizzes me. If I get it wrong, it explains again. Then I say yes or no. No sends the work back. Yes is tied to the exact code, so if anything changes afterwards, I have to look again.
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
<Flow :steps="['🎙 Wispr Flow', 'BMad<br/><small>PRD and Stories</small>', 'spec-kit<br/><small>spec · plan · tasks</small>', { label: 'Plan gate', kind: 'gate' }, 'Claude Code<br/><small>implement</small>', 'Playwright<br/><small>agent tests</small>', { label: 'Code gate', kind: 'gate' }, 'AI review<br/><small>read aloud</small>', { label: 'Review gate', kind: 'gate' }, 'Vercel<br/><small>deploy + logs</small>']" />
</div>

<div class="mt-6 op-70">No at the gate → back to Wispr Flow and discovery.</div>

<!--
Here's the actual pipeline.

I speak into Wispr Flow. BMad turns it into a PRD and Stories. spec-kit turns each Story into a spec, a plan, and tasks. Claude Code implements. Playwright tests it. Another AI agent reviews the code and reads its findings aloud.

spec-kit is set up to stop at three gates. Before implement: the plan gate. After implement: the code gate, with test results. After the AI review: the review gate. Each one is a Gate Review Pack, read aloud.

Our ship command deploys only after a review yes. No at any gate goes back to discovery.
-->

---

# Tools per stage

<div class="text-sm">

| Stage | Tool | Human gate |
|---|---|---|
| Requirements | Wispr Flow + BMad PRD | Approve the Stories |
| Estimation | AI: hours · points · tokens · $ | Accept the scope |
| Spec | GitHub spec-kit | **Plan gate**: spec, plan, tasks |
| Code | Claude Code | — |
| Test | Playwright, run by the agent | **Code gate**: what was built + tests |
| Review | AI code review, read aloud | **Review gate**: the exact code |
| Deploy + logs | Vercel CLI | `npm run ship` needs a review yes |
| Retro | AI from git and usage | Agree the lessons |

</div>

<div class="op-70 mt-2">All fit a Claude subscription.</div>

<!--
One tool per stage, all of it works with a Claude subscription.

Notice the right column. The human doesn't disappear. The human moves to decision points: the Stories, the scope, three gates in the build, plan, code, and review, and the lessons at the end.
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

# Gates with teeth

<div class="grid grid-cols-3 gap-6 mt-8 text-center">
  <div class="p-5 rounded-lg border-2 border-amber-500/60 bg-amber-500/5"><div class="text-xl font-bold">Plan gate</div><div class="op-70 mt-2">before any code</div><div class="text-sm mt-3 op-60">spec-kit prompts</div></div>
  <div class="p-5 rounded-lg border-2 border-amber-500/60 bg-amber-500/5"><div class="text-xl font-bold">Code gate</div><div class="op-70 mt-2">what was built + tests</div><div class="text-sm mt-3 op-60">spec-kit prompts</div></div>
  <div class="p-5 rounded-lg border-2 border-amber-500 bg-amber-500/15"><div class="text-xl font-bold">Review gate</div><div class="op-70 mt-2">the exact reviewed code</div><div class="text-sm mt-3 font-bold">enforced at ship + on GitHub</div></div>
</div>

<div class="mt-8 text-lg">My review yes is recorded with a fingerprint of everything that ships, code and slides. Change one line, and <code>npm run ship</code> stops:</div>

```text
# example output
$ npm run ship
Human gate not passed: code changed since the review gate was approved (approved 5ff7…, now 9c1e…).
Run /speckit-gate-review and answer yes before shipping.
```

<!--
Be honest about which gates have teeth.

The plan and code gates are prompts: spec-kit tells the agent to stop and ask me. The review gate is enforced: my answer goes into a ledger with a fingerprint of everything that ships, code and slides.

If anyone, human or AI, changes a shipped file after my yes, our ship command refuses to deploy. And since today, GitHub checks the same thing: my yes is a required check on every pull request, so nothing merges without it. The AI is still instructed, not prevented, from answering for me. The public ledger makes that visible.
-->

---

# Every change is a pull request

<div class="mt-10">
<Flow :steps="['PR', { label: 'Tests 🔒', kind: 'gate' }, 'AI review 💬<br/><small>diagram first</small>', 'Slide changes 💬<br/><small>before · after</small>', { label: 'My yes 🔒', kind: 'gate' }, 'Merge<br/><small>by me</small>']" />
</div>

<div class="mt-8 text-2xl text-center"><b>Robots advise. Tests and I decide.</b></div>

<div class="mt-4 text-center op-70">🔒 required check · 💬 advisory comment · the AI never merges</div>

<!--
This went live this morning, and it's the first thing this pipeline built for itself.

Every change, even my own slide edits, now arrives as a pull request. Two checks are required: the tests, and my review-gate yes for that exact code. The AI review and the slide pictures are comments. They help me decide, but they can't block, and the AI never presses merge. I do.
-->

---

# Review you can see

<div class="grid grid-cols-2 gap-6 mt-6">
<div class="text-center">
<div class="op-70 mb-2">Before</div>
<img src="/pr-demo/slide3-before.png" alt="Slide 3 before" class="rounded border border-gray-400/40" />
</div>
<div class="text-center">
<div class="op-70 mb-2">After</div>
<img src="/pr-demo/slide3-after.png" alt="Slide 3 after" class="rounded border border-gray-400/40" />
</div>
</div>

<div class="mt-6 text-lg">Pull request #6 changed one word. The bot posted <b>"1 of 21 slides changed"</b> and only this pair. The AI review opens with a diagram.</div>

<!--
Reading, listening, and now seeing.

On every pull request, CI photographs every slide before and after, and shows me only the ones that changed. This test PR changed one word, and the comment showed exactly this slide. One of twenty-one.

The AI review now starts with a diagram of the change. I look at pictures first, and read code only if something looks wrong.
-->

---

# When I said No

<div class="grid grid-cols-4 gap-4 mt-10 text-center">
  <div class="p-4 rounded-lg border-2 border-indigo-400/60 bg-indigo-500/10">Quiz<br/><b>passed ✅</b></div>
  <div class="p-4 rounded-lg border-2 border-amber-500 bg-amber-500/15"><b>"No.</b><br/>I didn't understand."</div>
  <div class="p-4 rounded-lg border-2 border-indigo-400/60 bg-indigo-500/10">An analogy<br/>+ a diagram</div>
  <div class="p-4 rounded-lg border-2 border-indigo-400/60 bg-indigo-500/10">Then<br/><b>yes</b></div>
</div>

<div class="mt-10 text-2xl text-center">A passed quiz is not understanding.</div>

<!--
Here's the honest moment.

At the review gate for the pull request workflow, I answered the quiz correctly. And then I said no. I didn't understand what I was approving.

The AI didn't push. It explained it again with an analogy and a picture, and then I said yes. That No is the most important thing in the ledger. It's the human doing the one job that's left.
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

# We've feared this before

<div class="grid grid-cols-5 gap-3 mt-4 text-sm text-center items-start">
<div>
<img src="/history/luddites-1812.jpg" alt="The Leader of the Luddites, engraving, 1812" class="h-40 mx-auto rounded object-cover" />
<div class="mt-2"><b>1812 · Looms</b><br/>Weavers smashed the machines.<br/><span class="op-70">Factories, mechanics, engineers followed.</span></div>
</div>
<div>
<img src="/history/switchboard-1911.jpg" alt="A telephone operator at a switchboard, 1911" class="h-40 mx-auto rounded object-cover" />
<div class="mt-2"><b>1911 · Telephones</b><br/>Operators connected every call.<br/><span class="op-70">Automatic switching came. The network grew.</span></div>
</div>
<div>
<img src="/history/eniac-1946.jpg" alt="Two women operating the ENIAC computer, 1946" class="h-40 mx-auto rounded object-cover" />
<div class="mt-2"><b>1946 · Computers</b><br/>"Computers" was a job title.<br/><span class="op-70">These women became the first programmers.</span></div>
</div>
<div>
<div class="h-40 flex items-center justify-center rounded border-2 border-indigo-400/60 bg-indigo-500/10 text-4xl">🏧</div>
<div class="mt-2"><b>1985–2002 · ATMs</b><br/>60,000 → 352,000 machines.<br/><span class="op-70">Bank tellers: 500,000 → 527,000.</span></div>
</div>
<div>
<div class="h-40 flex items-center justify-center rounded border-2 border-amber-500 bg-amber-500/15 text-4xl">🤖</div>
<div class="mt-2"><b>Today · AI</b><br/>AI writes the code.<br/><span class="op-70">Someone still has to understand it.</span></div>
</div>
</div>

<div class="mt-4 text-xs op-60 text-center">Photos: public domain, via Wikimedia Commons (1812 engraving; Library of Congress, 1911; U.S. Army Photo, 1946). ATM figures: James Bessen, IMF Finance &amp; Development, 2015.</div>

<!--
Every generation has had this fear.

In 1812, weavers smashed the machines that were taking their work. The machines came anyway, and so did factories, mechanics, and engineers.

In 1911, a person connected every phone call. Automatic switching ended that job, and the phone network grew into whole industries.

In 1946, "computer" was a job title. The women who operated ENIAC became the first programmers. A job that didn't exist before.

When ATMs spread, the number of machines went from sixty thousand to three hundred and fifty thousand. The number of bank tellers went up, not down.

Today it's AI writing code. And someone still has to understand it.
-->

---

# Only humans replace humans

<div class="grid grid-cols-3 gap-6 mt-10 text-center">
  <div class="p-5 rounded-lg border-2 border-indigo-400/60 bg-indigo-500/10"><div class="text-4xl font-bold">~60%</div><div class="mt-2">of US jobs in 2018 were in job types that didn't exist in 1940</div></div>
  <div class="p-5 rounded-lg border-2 border-indigo-400/60 bg-indigo-500/10"><div class="text-4xl">⚙️ → ⚙️⚙️⚙️</div><div class="mt-2">More moving parts<br/>need more people</div></div>
  <div class="p-5 rounded-lg border-2 border-amber-500 bg-amber-500/15"><div class="text-4xl">💪</div><div class="mt-2">Effort and action<br/>are how we stay</div></div>
</div>

<div class="mt-10 text-2xl text-center">AI won't replace you. A person who learns to use it will.</div>

<div class="mt-6 text-xs op-60 text-center">Autor, Chin, Salomons &amp; Seegmiller, "New Frontiers: The Origins and Content of New Work, 1940–2018", NBER Working Paper 30389, 2022.</div>

<!--
So here is what I believe.

Most of the jobs in America today didn't exist in 1940. About sixty percent of them. Technology takes tasks away, and it adds new work.

This pipeline is a small example. AI writes the code, and now there are specs, gates, reviews, and deploys. More moving parts, and every one of them needs a person who understands it.

Only humans replace humans. A person who learns to use AI will replace one who doesn't. That takes effort and action. That's how we stay.
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

# Next: install it in your repo

<div class="grid grid-cols-2 gap-x-12 gap-y-5 mt-10 text-xl text-left">
  <div>📦 <b>One command</b> into any existing repo</div>
  <div>🤖 <b>Claude Code and Codex</b> on day one</div>
  <div>🗣 <b>Spoken review</b> with diagrams and a quiz</div>
  <div>🔒 <b>Your yes</b> as a required check on GitHub</div>
</div>

<div class="mt-10 text-2xl text-center">No yes without understanding.</div>

<!--
Everything you've seen is being turned into a package you can install into your own repository.

One command, and it works with Claude Code or Codex. It teaches you the flow, reads you the review, shows you the diagram, asks you questions, and enforces your yes on GitHub.

The rule I took from that No: you can't approve what you don't understand.
-->

---

# Start on Monday

1. **Speak** your next requirement instead of typing it
2. **Spec first**: one spec per Story, kept as the source of truth
3. **Three gates per Story**: plan, code, review, each with a summary, a table, and a diagram
4. **Let AI review**, and listen to the findings
5. **Measure** estimate vs actual, tokens and dollars included

<!--
You don't need the whole pipeline on day one.

Pick one Story next week. Speak it, spec it, and stop it at three gates: plan, code, and review, each with a summary, a table, and a diagram. Measure it. The repo for this deck is public, so copy what you need.
-->

---

# Thank you!

<div class="mt-12 text-3xl text-center">Questions? Ask me anything.</div>

<!--
Thank you for staying with me. I'm happy to take any question, about the gates, the costs, or how to start in your own repo.
-->

---
layout: center
---

# "Wow, I can do that much with AI.<br/>I thought I only had to prompt."

<!--
That's the line I want you to leave with.

Now let me show you the recording of one feature going from my voice to production.
-->
