# Research: Publish the Blueprint and Links Slide

## QR generation
- **Decision**: `qrcode@1.5.4` (released 2024-08-05) via a script that writes SVG files to `public/qr/`, committed.
- **Rationale**: Static SVG = offline, crisp on any projector, no runtime dependency in the deck.
- **Alternatives**: runtime QR component (adds JS to the deck); online QR APIs (violates offline).

## QR verification
- **Decision**: Playwright screenshots each QR as rendered on the slide; `pngjs@7.0.0` decodes the PNG; `jsqr@1.4.0` reads the code; assert the URL.
- **Rationale**: Proves what the audience's phones will see, not just that the generator ran. `zbarimg` is not installed.
- **Alternatives**: regenerate-and-compare (doesn't prove scannability); manual phone scan only (kept as a code-gate check).

## Publishing
- **Decision**: `gh repo create 400kelvins/ai-driven-sdlc --public --source . --remote origin`, then `git push -u origin main`. Never `--all`/`--mirror`.
- **Rationale**: The local `backup-before-email-rewrite` branch holds the old email and must stay local. Name verified free.
- **Ordering**: push after the review gate yes (irreversible step last).

## License
- **Decision**: MIT (assumption from spec; presenter confirms at plan gate).
- **Rationale**: Attendees can reuse the blueprint freely.

## README
- **Decision**: Front page = one-paragraph pitch, lifecycle diagram (Mermaid renders on GitHub), three gates, artifact map with links, run/verify/ship commands.

## Deploy log check
- **Decision**: After `npm run ship`, `npx vercel inspect <url> --logs` → status + error lines into `gates/007-publish-repo-links-deploy.md`.
