# Gate Review Pack — Deploy check: Story 7

**Stage**: deploy-time log check (FR-8) | **Date**: 2026-10-12 | **Fingerprint shipped**: `52327a67d4b4249b`

## Summary (read aloud)

Story seven is live and public. The repository is public on GitHub under an Apache license, with only the main branch and only the noreply email in its history. The deck shipped through the review gate, and the deployment logs show a completed build with no errors. Both QR codes on the live links slide decode to the right addresses.

## Publish

| Check | Result |
|---|---|
| Repo | https://github.com/400kelvins/ai-driven-sdlc, **public**, license **Apache-2.0** |
| Branches on GitHub | `main` only |
| Commit emails (GitHub API) | `190785603+400kelvins@users.noreply.github.com` only (28 commits at publish) |
| Signed-out access | README, PRD, gate log → HTTP 200 |

## Deploy

| Check | Result |
|---|---|
| `npm run ship` | verify ✅ (30 unit, 16 e2e, build, notes leak) → review gate ✅ (story 7) → Vercel |
| Deployment | `ai-driven-sdlc-iusq7db3a-ai-sdlc2.vercel.app` → alias https://ai-driven-sdlc.vercel.app |
| Logs | `Build Completed` (15 s), `Deployment completed`, status **Ready**; 0 errors; 22 npm peer-dependency warnings (known, harmless) |
| Live routes | `/`, `/20`, `/qr/deck.svg`, `/qr/repo.svg` → 200 |
| Live QR decode (slide 21) | deck → `https://ai-driven-sdlc.vercel.app` ✅ · repo → `https://github.com/400kelvins/ai-driven-sdlc` ✅ |

## Incidents

| What | Action |
|---|---|
| First push used a stale keychain login (`amsterdam8888`) → 403 | Pushed with the active `gh` login for that command only; no global git config changed |
| Production build has no `__slidev__` debug handle | Live checks locate slides by visible heading |

## Estimate vs actual (Story 7)

| Measure | Estimate | Actual |
|---|---|---|
| Time | 1 h | ~14 min agent time (20:41–20:55 UTC), plus your three gate decisions |
| Story points | 3 | 3 |
| Test type | — | Playwright e2e with real QR decoding (local + live); node:test unit + temp-repo integration |
