# Deploy check: Story 2.3, CI runs the checker and config from main

**Stage**: deploy-time log check · **Date**: 2026-10-15 · **PR**: [#15](https://github.com/400kelvins/ai-driven-sdlc/pull/15), merged by the presenter (merge commit `07bb576`) · **Issue**: #14, closed

## Summary (read aloud)

Story two point three is merged and shipped. The understand-gate check now runs from main on every pull request, and you made it a required check. A throwaway pull request that changed package code and shrank the package area in the config failed the check, as it should. The deck deployment is ready, with no errors in its logs.

## Deploy

| Check | Result |
|---|---|
| Checks on PR #15 | `verify` ✅ · `human-gate` ✅ · `shots` ✅ · `publish` ✅ · `post` ✅ · `review` ❌ (no credit; not required) |
| `npm run ship` on `main` | verify ✅ (143 unit, 20 e2e, build, notes leak) → review gate ✅ (story 2.3) → Vercel |
| Deployment | `ai-driven-sdlc-9zep5sht3-ai-sdlc2.vercel.app`, status **Ready**, alias https://ai-driven-sdlc.vercel.app |
| Logs | 0 lines matching "error" |
| Live routes | `/`, `/11` → 200 |
| Branch protection (presenter) | required: `verify`, `human-gate`, `understand-gate` |

## Live proof (T013)

| PR | Result |
|---|---|
| #16: package code + package scope shrunk in `config.json` | `understand-gate` ❌ `package: code changed since the review yes`: judged by main's config ✅ |
| #17: one slide word | `verify` touched only `deck`; package tests skipped. Caveat: the deck e2e also failed (the throwaway edit changed an asserted line), which would skip the step too |

Both closed unmerged; remote branches deleted. Local branches `throwaway-attack` and `throwaway-deck` remain (the safety hook blocks branch deletion).

## Incidents

| What | Action |
|---|---|
| Committing the new ledger changed the old gate's fingerprint, so the gates cancelled each other | Old gate ignores `.understand-gate/gates.jsonl`; regression test; review gate re-approved |
| Local AI review: fork PRs were skipped (= passing) | The job now always runs and fails for forks |
| Review-gate quiz wrong twice (skipped = success) | Re-explained with the GitHub docs quote; right on the third try |

## Estimate vs actual

| Measure | Estimate | Actual |
|---|---|---|
| Time | 2 h | ~2 h 15 min including the live proof |
| Story points | 5 | 5 |
