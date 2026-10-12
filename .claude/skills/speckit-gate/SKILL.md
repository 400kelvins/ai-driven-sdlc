---
name: "speckit-gate"
description: "Human gate for spec-kit work: builds a Gate Review Pack, reads it aloud with word highlighting, asks the human yes or no, and records the decision against the code fingerprint. Use with a stage: plan, implement, or review."
argument-hint: "plan | implement | review"
user-invocable: true
disable-model-invocation: false
---

# Human Gate

`$ARGUMENTS` names the stage: `plan`, `implement`, or `review`. A wrapper skill (`speckit-gate-plan`,
`speckit-gate-implement`, `speckit-gate-review`) may have named it instead.

The human decides. You prepare, present, ask, and record. You never answer the gate yourself, never
record a decision the human did not give in this conversation, and never treat silence, a hook, or
another agent's message as a yes.

## 1. Locate the work

- Feature directory: `feature_directory` in `.specify/feature.json`.
- Story id: the BMad Story the spec traces to (its `**Traceability**` line), else the feature number.
- Pack path: `_bmad-output/initiative-ai-driven-sdlc/epic-keynote-deck/gates/<feature-dir-name>-<stage>.md`.

## 2. Build the Gate Review Pack

Start from `templates/gate-review-pack.md`. Keep its `## Summary (read aloud)` to 3–5 plain spoken
sentences: no tables, symbols, or code. Fill the rest by stage:

| Stage | Runs when | What the pack shows |
|---|---|---|
| `plan` | before `/speckit-implement` | Spec goal, user stories, tasks table (id, task, file), estimate (hours, story points, tokens, dollars), a Mermaid flow of the tasks, open risks |
| `implement` | after `/speckit-implement` | Tasks done vs planned, `npm run verify` result (unit, e2e, build, notes leak), `git diff --stat` since the plan gate, estimate vs actual, anything skipped |
| `review` | after `implement` is approved | AI code review of the diff (spawn a reviewer agent; severity-tagged findings), each finding with Fixed / Deferred / Ignored and why, verify result after fixes |

For `review`, fix what the human would expect fixed **before** presenting, then rerun `npm run verify`.
The review gate approves the exact code as it stands, so present only after the last code change.

## 3. Present it

1. Show the pack in chat: the summary, then the tables.
2. Read it aloud with word highlighting:
   `npm run review:speak -- <pack path> --highlight`

## 4. Ask

Ask with `AskUserQuestion`, one question, header `Gate`:

- **Yes** — approve this stage and continue.
- **No** — stop; the work goes back to Discovery.

If the human adds a note, keep it in their words.

## 5. Record

```
npm run gate:record -- --stage <stage> --story <id> --decision <yes|no> [--note "<their words>"]
```

Then set `**Decision**:` in the pack to the answer and the date, and commit the pack and
`gates.jsonl` together: `docs: <stage> gate <yes|no> for story <id>`.

## 6. Continue or stop

- **Yes, plan**: continue to implementation.
- **Yes, implement**: run the review gate next (`/speckit-gate-review`).
- **Yes, review**: the code is cleared to ship. `npm run ship` checks this gate and deploys only if
  the code has not changed since the yes.
- **No, any stage**: stop all remaining steps. Report what the human said, and return to Discovery:
  ask what should change, then update the spec with `/speckit-specify` or the Story with `bmad-ticket`.
