# Quickstart: Deck Scaffold

Prereqs: Node 22, npm; Vercel CLI logged in (`npx vercel whoami`).

1. `npm install && npx playwright install chromium`
2. `npm run dev` → open http://localhost:3030 — title "Goodbye, Manual SDLC?" shows.
3. Press → / ↓ six times: the 7 section titles appear in contract order; ← / ↑ go back.
4. `npm test` → Playwright smoke test passes.
5. `npm run build` → `dist/index.html` exists.
6. `npx vercel --yes` → preview URL serves the same 7 titles.
7. `npx vercel inspect <url> --logs` → no errors.
