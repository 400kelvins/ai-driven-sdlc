---
title: "PRD: AI-Driven SDLC Blueprint Package"
status: final
created: 2026-10-14
updated: 2026-10-14
---

# PRD: AI-Driven SDLC Blueprint Package

## Why

AI now writes most of the code, so the hard part of shipping is review: a person faces a wall of code at the end and approves what they don't understand. This package redefines the AI-driven SDLC for a developer with an existing repository. It installs BMad Method stories, spec-kit specs, and human gates, and it makes review an engaged experience: a spoken summary, call diagrams, a quiz, and a request for the human's input. Nothing merges unless a human understood it and said yes. Comparable tools (cc-sdd, OpenSpec, GZKit) structure specs or add quality checks, but none combines spoken, quizzed review with a required CI gate.

## Requirements to run

- A git repository hosted on GitHub, with GitHub Actions enabled.
- A repository admin who marks `human-gate` as a required check.
- Node.js 20.12 or later, Python 3.10 or later, and uv, which the upstream installers need.

## User Journeys

### UJ-1: Matthew adds a feature to an existing repo

**Matthew** is a senior developer at Sorab who uses Claude Code. He saw the talk and wants AI
development he can trust without reading walls of code.

1. **Install.** Matthew installs the package into his existing repository.
2. **Init.** The agent scans the repository and builds context: stack, structure, and conventions.
3. **Intent.** Matthew says, "I want to build feature X." The agent turns it into a story.
4. **Tracker.** The story is created on the tracker Matthew chose (GitHub first), after a one-time
   login.
5. **Implement.** The agent builds the feature.
6. **Review.** This is the heart of the product. A voice-over explains what was built, a call
   diagram shows how it fits, a quiz checks Matthew understood, and the agent asks for his input.
   Matthew answers yes or no.
7. **Outcome.** Matthew approved a feature he understands, without reading a wall of code.

Codex users follow the same journey; Claude Code and Codex are both supported at launch.

### UJ-1, step 6 in detail: the review

1. **Hear.** A spoken summary of what was built.
2. **See.** A call diagram showing which functions call which.
3. **Tasks.** A table of the tasks the work was split into.
4. **Diff walkthrough.** A guided tour of the changes, file by file.
5. **Quiz.** Multiple-choice questions, plus typed answers for open questions.
6. **Understanding check.** Matthew must get the quiz right, rate his own confidence, and explain
   the change in his own words; the AI points out gaps. A wrong answer re-shows that part and asks
   again. There is no way to approve without understanding. Matthew can say No at any step,
   even mid-quiz (FR-18).
7. **Decide.**
   - **Yes:** the code moves on.
   - **No:** the code is not pushed but stays on disk. The agent asks why (for example, a new
     approach) and what to do next.

Review time is not a goal. Understanding is.

### UJ-2: Matthew's first ten minutes

1. **Tour.** After install, the tool offers a guided tour, or a demo story, that explains why it
   exists, what BMad Method does, what spec-kit does, and how the AI talks to him (voice, diagrams,
   quizzes).
2. **Video.** A short walkthrough video recorded by the presenter. The product links to it.
3. **Sample run.** A demo story runs in Matthew's own repository on a demo branch he can delete, taking one small feature through every gate.
4. **First real feature.** The tool hands him into UJ-1 with his own feature.

## Features

### F1 Install
- **FR-1** One `npx` command installs the package into any existing git repository, whatever its stack.
- **FR-2** The installer asks which agent the developer uses (Claude Code or Codex) and sets up that agent's files.
- **FR-3** The installer runs the pinned BMad Method and spec-kit installers rather than bundling copies of them (NFR-4).
- **FR-4** One command uninstalls the package (NFR-5).

### F2 Onboarding
- **FR-5** After install, the developer is offered a guided tour that explains why the product exists, what BMad Method does, what spec-kit does, and how the AI talks to them.
- **FR-6** The tour links to the presenter's walkthrough video.
- **FR-7** A demo story runs in the developer's own repository on a demo branch they can delete, passing through every gate.

### F3 Repository init
- **FR-8** The agent scans the repository and records its stack, structure, and conventions as context for later steps.

### F4 Stories and tracker
- **FR-9** The developer states a feature in plain words, by voice or by typing, and the agent turns it into a story.
- **FR-10** The story is created on the developer's tracker. GitHub Issues comes first, with a one-time login.

### F5 Spec and implement
- **FR-11** Each story goes through spec, plan, tasks, and implement, with a plan gate and an implement gate where the developer says yes or no.
- **FR-28** The package installs spec-kit hooks that stop the agent at each gate and wait for the developer's decision before it continues.

### F6 Review experience
- **FR-12** The review opens with a spoken summary of what was built (NFR-2).
- **FR-13** A call diagram shows which functions call which, for the code that changed.
- **FR-14** A table lists the tasks the work was split into.
- **FR-15** A guided walkthrough covers the diff file by file.
- **FR-16** A quiz asks multiple-choice questions plus open questions with typed answers.
- **FR-17** Understanding requires all three:
  - every quiz answer correct
  - self-rated confidence of at least 3 out of 5
  - an own-words explanation that names every changed module, which is the deciding check.

  A separate AI session grades the explanation, not the session that wrote the code. A wrong answer re-shows that part and asks again.
- **FR-18** Yes is only possible after understanding is shown. No is available at every step of the review, including mid-quiz, with one action.

### F7 Decision handling
- **FR-19** On yes, the work moves on to a pull request.
- **FR-20** On no, nothing is pushed and the code stays on disk. The agent asks why and what to do next.
- **FR-21** Every decision is recorded in a gate log, tied to a fingerprint of the exact code that was reviewed.
- **FR-27** A yes counts only if it carries proof that it came from the human, not the agent. The proof is either the human's GitHub identity (a pull request comment or review from their account) or a commit signed with the human's key; the repository picks one. Any change to the code after the yes cancels it.

### F8 Enforcement
- **FR-22** A required CI check, `human-gate`, blocks a merge unless a recorded yes covers the pull request's exact code (NFR-3).
- **FR-23** An AI review comment is posted on each pull request. It is advisory and cannot merge.
- **FR-24** Agents never merge pull requests. The human presses merge.
- **FR-26** Every pull request shows, inline, a diagram of what changed and screenshots of any changed UI. Screenshots are stored outside the main branch.

### F9 Constitution
- **FR-25** The package installs a starter constitution that the developer can edit, holding the gate rules the agent must follow.

## Success Metrics

- **SM-1 Monthly review held.** The maintainer reviews how the product is doing every month: usage, issues, open PRs. Target: 12 of 12 months.
- **SM-2 Open to contributors.** Anyone can push a change to GitHub and open a PR to improve the product. Target: a contribution guide exists, and outside PRs get a response at the next monthly review.
- **SM-3 Gate stays on.** Share of public repositories that installed the package and still enforce `human-gate` 30 days later. Tests the thesis: people keep the gate because review is worth it.

### Counter-metrics

- **CM-1 Neglect.** A month passes with no review: the product is failing, even if installs and stars look good.
- **CM-2 Rubber stamp.** A first-try quiz pass rate near 100% means the quiz is too easy to prove understanding. Measured locally from the repo's gate log (first-try passes, re-explains, No count); nothing leaves the repo (NFR-1).

## Non-Functional Requirements

- **NFR-1 Privacy.** v1 sends no telemetry. The monthly review (SM-1) uses public signals: npm downloads, GitHub stars, issues, PRs. Any future telemetry is opt-in, asked once at install, and never includes code, diffs, file or repo names, quiz answers, or voice.
- **NFR-2 Voice everywhere.** Spoken review works on macOS, Windows, and Linux. Where the OS has no word-level speech events, the review falls back to speech in the browser.
- **NFR-3 Agent-agnostic.** Claude Code and Codex are supported on day one. Enforcement does not depend on any agent's hooks: the required CI `human-gate` check is the one enforcement point.
- **NFR-4 Pinned upstreams.** The BMad Method and spec-kit installers run at pinned versions. A version upgrade ships only after contract tests pass against it.
- **NFR-5 Safe install.** The installer never overwrites an existing file without asking. Uninstall leaves the repository as it was before install.

## Non-Goals

- **Team collaboration.** v1 treats everyone on a repository as one reviewer, with no per-person roles.
- **Deploy and retrospective.** Out of scope for v1.
- **Telemetry.** v1 sends no data (NFR-1).
- **Other git hosts.** Repositories outside GitHub get no CI enforcement in v1.

## Open Questions

- **OQ-1 Product name (decided).** Reserve both `understand-gate` and `read-listen-see` on npm; one is primary, the other an alias. Neither may contain "BMad" (trademark). Primary to be confirmed at architecture.
- **OQ-2 Trackers after GitHub.** Which tracker comes next (Jira, Linear)? Owner: presenter. Revisit at the first monthly review.
