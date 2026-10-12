# Quickstart: Publish the Blueprint and Links Slide

1. `npm run qr` → `public/qr/deck.svg`, `public/qr/repo.svg` exist.
2. `npm run dev` → "Try It Yourself" slide shows both codes and addresses with Wi-Fi off.
3. `npm run verify` → includes `tests/links.spec.ts`: both codes decode to the contract URLs.
4. Scan both codes with a phone from the projector (code gate).
5. Review gate yes → `gh repo create … --public` + `git push -u origin main`.
6. Signed-out browser: repo visible; README links reach PRD, Story, spec, gate pack, gate log.
7. `npm run ship` → deploy; `npx vercel inspect <url> --logs` → deploy Gate Review Pack.
