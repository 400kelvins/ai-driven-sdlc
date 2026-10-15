# Deploy check: Story 2.2, ledger v2 and check every touched scope

**Stage**: deploy-time log check · **Date**: 2026-10-15 · **PR**: [#13](https://github.com/400kelvins/ai-driven-sdlc/pull/13), merged by the presenter at 08:53 UTC (merge commit `ddb1a2c`) · **Issue**: #12, closed

## Summary (read aloud)

Story two point two is merged and shipped. understand-gate can now record decisions per area, check every area a branch touched, and show quiz stats. npm run ship verified the tests, confirmed your review-gate yes, and deployed the deck. The deployment is ready, with no errors in its logs.

## Deploy

| Check | Result |
|---|---|
| Checks on PR #13 | `verify` ✅ · `human-gate` ✅ · `shots` ✅ · `publish` ✅ · `post` ✅ · `review` ❌ (AI review skipped: no credit; not required) |
| `npm run ship` on `main` | verify ✅ (131 unit, 20 e2e, build, notes leak) → review gate ✅ (story 2.2) → Vercel |
| Deployment | `ai-driven-sdlc-ktk4dqi1p-ai-sdlc2.vercel.app`, status **Ready**, alias https://ai-driven-sdlc.vercel.app |
| Logs | 0 lines matching "error" |
| Live routes | `/`, `/11` → 200 |

## Incidents

| What | Action |
|---|---|
| Local AI review: 3 critical holes | 2 fixed (base config, append-only ledger); fake yes line deferred to Story 2.4 |
| Review-gate quiz answered wrong twice | Re-explained with exam-guide and pen-notebook analogies; right on the re-ask |
| CI AI review failed (no credit) | The presenter reviewed the PR |

## Estimate vs actual

| Measure | Estimate | Actual |
|---|---|---|
| Time | 1.5 h | ~1 h from spec to deploy, including one review round |
| Story points | 5 | 5 |
