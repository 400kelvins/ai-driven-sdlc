# Deploy check: Story 2.1, package workspace and per-scope fingerprints

**Stage**: deploy-time log check · **Date**: 2026-10-15 · **PR**: [#11](https://github.com/400kelvins/ai-driven-sdlc/pull/11), merged by the presenter at 22:26 UTC (merge commit `ff9fae3`) · **Issue**: #10, closed

## Summary (read aloud)

Story two point one is merged and shipped. The understand-gate package now lives in this repository, with separate fingerprints for the deck and the package. npm run ship verified the tests, confirmed your review-gate yes, and deployed the deck. The deployment is ready, with no errors in its logs. The package is not published to npm; that comes with the release story.

## Deploy

| Check | Result |
|---|---|
| Checks on PR #11 | `verify` ✅ · `human-gate` ✅ · `shots` ✅ · `publish` ✅ · `post` ✅ · `review` ❌ (AI review skipped: no credit; not required) |
| `npm run ship` on `main` | verify ✅ (102 unit, 20 e2e, build, notes leak) → review gate ✅ (story 2.1) → Vercel |
| Deployment | `ai-driven-sdlc-g57glkl13-ai-sdlc2.vercel.app`, status **Ready**, alias https://ai-driven-sdlc.vercel.app |
| Logs | 0 lines matching "error" |
| Live routes | `/`, `/11` → 200 |

## Incidents

| What | Action |
|---|---|
| The CI AI review failed (no credit) | The presenter reviewed the PR; a local AI reviewer's findings were fixed before the review gate |
| Local AI review: 4 critical fingerprint holes | All fixed with regression tests; the same holes in `scripts/gate.mjs` are left until Story 2.6 removes it |
| The merge commit carries the presenter's account email | Left as is (presenter's decision) |

## Estimate vs actual

| Measure | Estimate | Actual |
|---|---|---|
| Time | 1 h | ~1 h 10 min from spec to deploy, including one review round |
| Story points | 3 | 3 |
