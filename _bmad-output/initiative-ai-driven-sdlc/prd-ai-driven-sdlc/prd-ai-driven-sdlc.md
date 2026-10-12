---
title: AI-Driven SDLC — Conference Talk + Living Demo Project
status: final
created: 2026-10-11
updated: 2026-10-11
---

# PRD: AI-Driven SDLC — Conference Talk + Living Demo Project
*Working title — confirm.*

## 1. Vision

This project is a conference talk that proves its own claim. The slide deck is a live web app on Vercel, and every feature added to it travels the full software lifecycle with AI doing the work: requirements, estimation, specs, code, review, test, deployment, support, log checking, and retrospective. The audience watches a recorded run of a feature going from a spoken idea to production, with no hand-typed prompts and no hand-written code.

The shift is not "AI writes code faster." It moves humans from every keystroke to a few decision gates. And humans decide best through the senses they are good at: **reading, listening, and seeing**. So every stage of this lifecycle must show its output in those three forms, as concise text, voice, and visuals (diagrams, tables, charts, infographics). Then a person at a gate can understand what changed and approve or redirect it in seconds.

The line we want the audience to leave with: *"Wow, I can do that much with AI. I thought I only had to prompt."* Why now: agentic AI in 2026 has moved fast enough that a single presenter can run the whole lifecycle end to end on stage, using tools that come with a Claude subscription.

## 3. Glossary *(growing)*

- **Deck** — The slide deck web app in this repository, deployed to Vercel. It is both the talk and the demo product.
- **Stage** — One step of the AI-driven SDLC (e.g. requirements, spec, code, review, deploy, support, retrospective).
- **Gate** — A point between Stages where a human reviews AI output and answers yes or no. A human is always involved at Gates.
- **Gate Review Pack** — The material AI prepares for a Gate: a task summary, a table, a diagram, and an optional read-aloud of what was done.
- **Discovery** — The opening phase where requirements are gathered by voice. A "no" at any Gate returns work here.
- **Story** — A unit of work with acceptance criteria, created by BMad from a spoken idea. Each Story is tested by an AI agent.
- **Presenter View** — The speaker-only screen of the Deck.
- **Audience View** — The projected screen of the Deck.

## 4. Features

### 4.1 Presenter Deck
**Description:** The Deck behaves like Apple Keynote. The speaker drives it with the arrow keys. The Audience View shows only the slide, while the Presenter View shows the speaker what they need to stay on time and on script.

#### FR-1: Arrow-key navigation
The presenter moves between slides with the keyboard arrow keys.

**Consequences (testable):**
- → and ↓ advance one slide; ← and ↑ go back one slide.
- Navigation in the Presenter View moves the Audience View in sync.

#### FR-2: Presenter View
The presenter sees a Presenter View with speaker notes, elapsed time, and the current time. [ASSUMPTION: two screens, laptop and projector; the current and next slide are shown.]

**Consequences (testable):**
- Presenter View shows speaker notes for the current slide.
- Presenter View shows elapsed time since the talk started and the current time.
- Presenter View shows a countdown from 20 minutes (the talk slot).

#### FR-3: Private notes
Speaker notes never appear in the Audience View.

#### FR-19: Switch to live monitoring
During the talk the presenter can switch from the slides to a live monitoring view to show what is happening (e.g. logs, deployment status), then switch back to the same slide. [ASSUMPTION: human-viewed live view; no continuous AI log analysis.]

### 4.2 Human Gates with Gate Review Packs
**Description:** A human is always involved, but reviewing no longer means reading diffs line by line. At each Gate, AI prepares a Gate Review Pack that plays to how humans take in information best: reading (task summary), seeing (table, diagram), and listening (AI reads out what was done). The human answers yes or no. "Yes" moves work to the next Stage. "No" sends the work back to Discovery.

#### FR-4: Gate Review Pack
At every Gate, AI produces a Gate Review Pack containing a task summary, a table, a diagram, and an option to have it read aloud.

#### FR-5: Gate decision
The human answers yes or no at each Gate. A yes advances the work to the next Stage; a no returns it to Discovery.

### 4.3 AI Estimation
**Description:** Before work starts, AI estimates each feature three ways so the human can weigh time against cost at the Gate.

#### FR-6: Three-way estimate
AI estimates each feature in hours, story points, and cost (tokens and dollars). The estimate is part of the Gate Review Pack.

**Consequences (testable):**
- Every feature's Gate Review Pack shows estimated hours, story points, token count, and dollar cost.

### 4.4 Deploy and Log Check
**Description:** The Deck runs locally first. Only once everything works locally does AI deploy it to Vercel, and then it checks the logs at deploy time to confirm the release is healthy. There is no continuous AI log monitoring, because it costs tokens. After deployment, support is led by a human.

#### FR-7: Local-first, then AI deployment
The Deck runs and is verified locally. After local verification passes, AI deploys approved changes to Vercel.

**Consequences (testable):**
- No Vercel deployment happens before the local run is verified.
- The talk can be presented from the local build.

#### FR-8: Deploy-time log check
Right after each deployment, AI reads the deployment logs and reports health in a Gate Review Pack.

**Out of Scope:**
- Continuous or scheduled AI log monitoring (token cost).

### 4.5 Sprint Retrospective
**Description:** The retrospective is the talk's payoff: "I built this Keynote-like Deck in one sprint." AI compiles what was built during the sprint and presents it as part of the talk.

#### FR-9: Sprint retrospective
AI produces a retrospective of the sprint that built the Deck, shown in the talk.

**Consequences (testable):**
- The retrospective shows features shipped in the sprint.
- It shows estimated versus actual time per feature.
- It shows total cost in tokens and dollars.
- It shows the type of testing used for each feature.

### 4.6 Voice-to-Story Pipeline
**Description:** The presenter presses the Wispr Flow function key and speaks an idea for a new slide. BMad shapes the idea and turns it into Stories. spec-kit takes each Story through spec, plan, tasks, and implementation. An AI agent tests each Story. AI reviews the code and reads its findings back aloud, so the presenter reviews by listening. The presenter never writes code by hand.

#### FR-10: Voice capture
The presenter can start Discovery by speaking. Wispr Flow turns speech into text that BMad takes as input.

#### FR-11: Stories from voice
BMad turns the spoken idea into one or more Stories with acceptance criteria.

#### FR-12: Spec-driven implementation
spec-kit turns each Story into a spec, plan, and tasks, and implements it. No code is written by hand.

#### FR-13: Agent-tested Stories
An AI agent tests each Story against its acceptance criteria and reports the result in a Gate Review Pack. [ASSUMPTION: test type, e.g. browser test of the slide, TBD.]

#### FR-14: Spoken code review
AI reviews every change and reads the findings aloud to the presenter, along with the written summary.

### 4.7 Embedded Demo Recording
**Description:** There is no live demo. The presenter records one full run of the Voice-to-Story Pipeline, and the recording plays inside the Deck.

#### FR-15: Video slide
The Deck can play an embedded demo recording on a slide, driven by the presenter's controls.

**Consequences (testable):**
- The recording plays from the Deck without leaving the presentation.
- [ASSUMPTION: the recording works offline (bundled or cached) in case the venue Wi-Fi fails.]

### 4.8 Behind-the-Scenes Walkthrough
**Description:** During the talk the presenter says, "This is what AI made, and this is what happened behind the scenes." The Deck links the finished product to the trail that produced it: the public GitHub repository, the Stories, the Gate Review Packs, and the live Vercel deployment.

#### FR-16: Public repository
The Deck's code, Stories, specs, and Gate Review Packs are published in a public GitHub repository.

#### FR-17: Public deployment
The Deck is live on a public Vercel URL that anyone in the audience can open. [ASSUMPTION: the URL and repo link are shown on a slide, e.g. as a QR code.]

#### FR-18: Behind-the-scenes slides
The Deck includes slides that show the artifacts from the sprint (Stories, a Gate Review Pack, a code review summary, the deploy log check) next to the result they produced.

## 5. Non-Goals (Explicit)
- The Deck *is* the presenter's own Keynote replacement for this talk. It is not built as a product for other speakers.
- No live demo on stage; the pipeline run is pre-recorded.
- No continuous AI log monitoring after deployment.
- No hand-written code anywhere in the repository.
- No editable PowerPoint export. [ASSUMPTION]

## 6. MVP Scope (deadline: talk on 2026-10-14)

### 6.1 In Scope (must ship before the talk)
- Presenter Deck: arrow-key navigation, Presenter View with notes, timer, and 20-minute countdown, switch to live monitoring (FR-1 to FR-3, FR-19).
- Local-first: Deck verified locally, then deployed to Vercel (FR-7).
- Talk content slides for a 20-minute talk, including old vs. new SDLC and "What's left for humans?". [ASSUMPTION]
- Embedded demo recording of one full Voice-to-Story Pipeline run (FR-10 to FR-15).
- Retrospective slide (FR-9).
- Public GitHub repository and Vercel deployment (FR-16, FR-17).

### 6.2 Out of Scope for MVP (cut if time runs short)
- Live charts generated automatically from repository data. A static chart built by AI is acceptable. [ASSUMPTION]
- Read-aloud for every Gate. Code review read-aloud (FR-14) is the one to show. [ASSUMPTION]
- Polished Gate Review Packs for every Stage. One good example per Stage type is enough for the talk. [ASSUMPTION]

## 7. Success Metrics

**Primary**
- **SM-1**: The Deck runs the full 20-minute talk without a technical failure. Validates FR-1 to FR-3, FR-15.
- **SM-2**: Every feature in the Deck traces to a Story, a Gate decision, and an AI review in the public repo. Validates FR-16, FR-18.

**Secondary**
- **SM-3**: Audience members open the live Deck or repository during or after the talk. [ASSUMPTION: measured by Vercel analytics and GitHub stars/visits.]

**Counter-metrics (do not optimize)**
- **SM-C1**: Number of features shipped. More features with weaker Gates would undercut the talk's message. Counterbalances SM-2.

## 8. Open Questions
1. Which AI agent tests Stories and reviews PRs and branch diffs? Candidates are in the addendum. Owner: presenter. Needed before recording.
2. Confirm retrospective wording from voice transcript: "feature-shaped" = features shipped; "total controller cost" = total token and dollar cost.

## 9. Assumptions Index
- §4.1 FR-2: two screens; current and next slide shown in the Presenter View.
- §4.6 FR-13: test type (e.g. browser test of the slide) TBD.
- §4.7 FR-15: recording works offline.
- §4.8 FR-17: URL and repo shown on a slide, e.g. as a QR code.
- §4.1 FR-19: live monitoring view is human-viewed, not AI analysis.
- §5: no PPTX export.
- §6: content scope; static charts acceptable; read-aloud shown for code review only; one Gate Review Pack example per Stage type.
- §7 SM-3: measurement via Vercel analytics and GitHub.
