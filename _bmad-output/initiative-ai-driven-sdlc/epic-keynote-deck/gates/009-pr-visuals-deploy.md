# Deploy check: Story 12, visual PRs

**Stage**: deploy-time log check · **Date**: 2026-10-14 · **PR**: [#5](https://github.com/400kelvins/ai-driven-sdlc/pull/5), merged by the presenter at 13:41 UTC (merge commit `12cd77d`) · **Issue**: #3, closed

## Summary (read aloud)

Story twelve is live. You merged pull request five after every check passed. Issue three closed with it. On main, npm run ship verified the tests, confirmed your review-gate yes, and deployed. The deployment is ready, with no errors in its logs. Main has no screenshot files.

## Deploy

| Check | Result |
|---|---|
| Checks on PR #5 | `verify` ✅ · `human-gate` ✅ · `review` ✅ · `post` ✅ · `shots` ✅ · `publish` ✅ |
| `npm run ship` on `main` | verify ✅ (70 unit, 16 e2e, build, notes leak) → review gate ✅ (story 12) → Vercel |
| Deployment | `ai-driven-sdlc-ng63xhhqu-ai-sdlc2.vercel.app`, status **Ready**, alias https://ai-driven-sdlc.vercel.app |
| Logs | 0 lines matching "error" |
| Live routes | `/`, `/3` → 200 |
| Screenshot files on `main` | 0 |

## Live proof (T015)

| PR | Result |
|---|---|
| #6, one word on slide 3, closed unmerged | `1 of 21 slides changed`, slide 3 before and after, served from `pr-assets` (HTTP 200, image/png) |
| #5 | `No slide changed` |

## Incidents

| What | Action |
|---|---|
| Public scan: GitHub web merges (`e4567a2`, `12cd77d`) carry the presenter's account email | The presenter chose to leave the history as it is. The fix for future merges is the GitHub setting "Keep my email addresses private" |
| The safety hook blocked a test fixture string and a forced local branch delete | Used a harmless fixture; `gh pr close --delete-branch` removed the throwaway branch |
| The quizzes at the plan and implement gates were answered wrong first | Re-explained with spot-the-difference and bouncer analogies, then asked again; the review gate quiz passed on the first try |

## Estimate vs actual

| Measure | Estimate | Actual |
|---|---|---|
| Time | 1.5 h | ~1 h 25 min from spec to deploy, including two review rounds and three CI cycles |
| Story points | 5 | 5 |
| Test type | — | node:test unit, including the artifact check run on crafted folders; live throwaway PR |
