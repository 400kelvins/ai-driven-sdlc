# Implementation Plan: Ledger v2 and Check Every Touched Scope

**Branch**: `012-ledger-v2` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

## Summary

| Part | What |
|---|---|
| Ledger | `src/ledger.mjs`: `LEDGER = '.understand-gate/gates.jsonl'`, `readLedger(root)` (line-numbered parse errors), `appendDecision(root, entry)` |
| Record | `understand-gate record --scope deck,package --stage review --story 2.2 --decision yes [--note ..] [--attempts n] [--first-try yes\|no] [--confidence 1-5]`; refuses dirty scope files |
| Touched | `src/touched.mjs`: `git merge-base <base> HEAD`, then `git diff --name-only -z --no-renames <mb>` (working tree) + untracked, mapped to scopes |
| Check | `understand-gate check --base <ref>` (touched scopes) or `--all`; latest `review` line per scope must be yes and match |
| Stats | `understand-gate stats`: decisions, no count, first-try rate, re-explanations (`attempts - 1`) |
| Scope rule | `inScope` returns false for the ledger path, always |

## Ledger line (AD-4)

```json
{"ts":"2026-10-15T08:00:00.000Z","scope":"deck","stage":"review","story":"2.2","decision":"yes",
 "fingerprint":"1afa3c26d4d4de6d","proof":null,"attempts":2,"firstTry":false,"confidence":4,"note":"..."}
```

Fields are only added later, never renamed. `attempts`, `firstTry`, `confidence`, `note` are `null` when not given.

## Technical Context

- Node ≥ 20.12, built-ins only; reuses `fingerprint`, `repoRoot`, `loadConfig` from Story 2.1.
- Git calls reuse Story 2.1's safe options (NUL-separated, literal pathspecs, no renames).
- Tests: `node:test` on throwaway repos with a base branch and a feature branch.
- Not in this story: CI wiring (2.3), proof (2.4), migration and ship (2.6).

## Constitution Check

| Principle | Status |
|---|---|
| I. No hand-written code | ✅ |
| II. Spec is source of truth | ✅ Story 2.2, issue #12, spec 012 |
| III. Humans at the gates | ✅ three gates; human merges |
| IV. Local-first | ✅ |
| V. Simplicity | ✅ three small modules, no dependencies |
| VI. Offline-safe | ✅ |

## Project Structure

```text
packages/understand-gate/
  bin/understand-gate.mjs     # + record, check, stats
  src/ledger.mjs  src/touched.mjs  src/args.mjs
  src/scopes.mjs              # ledger always out of scope
  tests/ledger.test.mjs  tests/check.test.mjs  tests/stats.test.mjs
```
