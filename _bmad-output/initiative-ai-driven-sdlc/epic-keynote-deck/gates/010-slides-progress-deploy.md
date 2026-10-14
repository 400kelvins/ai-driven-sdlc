# Deploy check: Story 13, slides show the progress

**Stage**: deploy-time log check · **Date**: 2026-10-14 · **PR**: [#7](https://github.com/400kelvins/ai-driven-sdlc/pull/7), merged by the presenter at 14:01 UTC (merge commit `3938cd8`) · **Issue**: #4, closed

## Summary (read aloud)

Story thirteen is live. The deck now shows the pull request workflow, the before and after pictures, the moment you said no, and the package that comes next. npm run ship verified the tests, confirmed your review-gate yes, and deployed. The deployment is ready, with no errors in its logs.

## Deploy

| Check | Result |
|---|---|
| Checks on PR #7 | `verify` ✅ · `human-gate` ✅ · `review` ✅ · `post` ✅ · `shots` ✅ · `publish` ✅ |
| `npm run ship` on `main` | verify ✅ (70 unit, 20 e2e, build, notes leak) → review gate ✅ (story 13) → Vercel |
| Deployment | `ai-driven-sdlc-iaix29v1f-ai-sdlc2.vercel.app`, status **Ready**, alias https://ai-driven-sdlc.vercel.app |
| Logs | 0 lines matching "error" |
| Live routes | `/`, `/11`, `/12`, `/pr-demo/slide3-after.png` → 200 |

## Incidents

| What | Action |
|---|---|
| The merge commit again carries the presenter's account email | Left as is (presenter's decision); fix with the GitHub setting "Keep my email addresses private" |
| The slide comment listed 16 of 25 slides | Expected: three inserted slides shift later numbers (Story 12's known limit) |

## Estimate vs actual

| Measure | Estimate | Actual |
|---|---|---|
| Time | 40 min | ~35 min from spec to deploy, including one review round |
| Story points | 2 | 2 |
