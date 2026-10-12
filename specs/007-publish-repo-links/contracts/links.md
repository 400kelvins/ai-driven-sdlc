# Contract: Links

| id | Label | URL | QR file |
|---|---|---|---|
| deck | Live deck | https://ai-driven-sdlc.vercel.app | `public/qr/deck.svg` |
| repo | Blueprint repo | https://github.com/400kelvins/ai-driven-sdlc | `public/qr/repo.svg` |

`scripts/make-qr.mjs` and `tests/links.spec.ts` both read these two URLs from one place:
`scripts/links.json`.
