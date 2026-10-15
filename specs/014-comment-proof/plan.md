# Implementation Plan: Proof of a Human Yes, by Pull Request Comment

**Branch**: `014-comment-proof` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

## Summary

| Part | What |
|---|---|
| Config | `.understand-gate/config.json` gains `"proof": "comment"`, `"reviewers": ["400kelvins"]`; absent `proof` = none (old behaviour) |
| Checker | `check --base <ref> --comments <file>`: with comment proof (from the base config), each touched scope also needs a comment line `/understand-gate yes <scope> <fingerprint>` by a listed, non-bot login. No `--comments` under comment proof → fail with the lines to post |
| Proof module | `src/proof.mjs`: `commentLine(scope, fp)`, `hasCommentProof(comments, reviewers, scope, fp)` |
| CI | `understand-gate.yml`: `permissions: contents: read, pull-requests: read`; step `gh api --paginate repos/$REPO/issues/$PR/comments > comments.json` with the run's token; checker gets `--comments ../comments.json` |
| Re-run | New `understand-gate-rerun.yml` on `issue_comment` (created, edited); only for PR comments containing `/understand-gate yes`; finds the PR's latest `understand-gate` run and re-runs it. `permissions: actions: write, contents: read, pull-requests: read`; no checkout |
| Record | `scripts/gate-record.mjs` prints `Paste on the PR:` + one line per touched scope after a review yes |
| Skill | `speckit-gate` step 5: after a review yes, show the lines and ask the presenter to post them |
| Docs | package README "Proof of a human yes" with the known limit |

## Comment format

```text
/understand-gate yes deck 1afa3c26d4d4de6d
/understand-gate yes package b98f9276aa9ae733
```

One line per scope; matched as a whole line (surrounding lines ignored), case-sensitive.

## Constitution Check

| Principle | Status |
|---|---|
| I. No hand-written code | ✅ |
| II. Spec is source of truth | ✅ Story 2.4, issue #18, spec 014 |
| III. Humans at the gates | ✅ the yes is now visible on the PR, posted by the presenter |
| IV. Local-first | ✅ |
| V. Simplicity | ✅ one module, one small workflow |
| VI. Offline-safe | ✅ deck unaffected |
