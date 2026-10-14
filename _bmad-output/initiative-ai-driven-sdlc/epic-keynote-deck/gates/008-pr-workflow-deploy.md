# Deploy check: Story 11, PR workflow

**Stage**: deploy-time log check · **Date**: 2026-10-14 · **PR**: [#2](https://github.com/400kelvins/ai-driven-sdlc/pull/2), merged by the presenter at 12:58 UTC (merge commit `e4567a2`) · **Issue**: #1, closed

## Summary (read aloud)

Story eleven is live. You merged pull request two after both required checks passed. Issue one closed with it. On main, npm run ship verified the tests, confirmed your review-gate yes, and deployed. The deployment is ready, with no errors in its logs.

## Deploy

| Check | Result |
|---|---|
| Checks on PR #2 head `0d2dbce` | `verify` ✅ · `human-gate` ✅ · `review` ✅ · `post` ✅ |
| `npm run ship` on `main` | verify ✅ → review gate ✅ (story 11) → Vercel |
| Deployment | `ai-driven-sdlc-7sjepkj3z-ai-sdlc2.vercel.app`, status **Ready**, alias https://ai-driven-sdlc.vercel.app |
| Logs | 0 lines matching "error" |
| Live routes | `/`, `/20` → 200 |

## Incidents

| What | Action |
|---|---|
| The subscription token was rejected (the organization requires a workspace) | Switched to an API key plus the workspace ID repo variable |
| The first "merged" report came before the merge was confirmed | Checked GitHub, which showed OPEN; the two-click confirm finished it |
| Review gate: first No ("didn't understand") even though the quiz passed | Re-explained with an analogy and a diagram; then yes. Feeds the understanding rules in the package PRD (FR-17) |
