# Research: Deck Scaffold

## Slidev version
- **Decision**: `@slidev/cli@53.0.0`, `@slidev/theme-default@0.25.0`, pinned exact.
- **Rationale**: Latest stable, released 2026-09-16 (≈4 weeks old); pinning avoids surprise changes before the talk.
- **Alternatives**: Marp (no presenter mode out of the box), reveal.js (more hand-built HTML).

## Section composition
- **Decision**: In `slides.md`, one slide per section with frontmatter `src: ./pages/<name>.md`.
- **Rationale**: Slidev built-in; each file owned by one Story, so parallel Stories never collide.
- **Alternatives**: Single `slides.md` (merge conflicts), custom Vue routing (unnecessary code).

## Arrow-key navigation
- **Decision**: Slidev default shortcuts (→/↓ next, ←/↑ prev). No custom key map.
- **Rationale**: Meets FR-001/FR-002 with zero code. Note: Slidev's ↓/↑ move to next/prev *slide*
  while →/← step through clicks/animations; with no click steps they behave identically.

## Offline fonts
- **Decision**: Headmatter `fonts: { provider: none }` and system font stack.
- **Rationale**: Default theme pulls Google Fonts; constitution VI forbids runtime network.

## Hosting
- **Decision**: Vercel static: `buildCommand: npm run build`, `outputDirectory: dist`, rewrite
  `/(.*)` → `/index.html` for slide deep links. Preview deploy via `npx vercel --yes`; logs via
  `npx vercel inspect <url> --logs`.
- **Rationale**: Local-first then preview (constitution IV); no git integration needed yet.

## Testing
- **Decision**: Playwright smoke test against `slidev --port 3030`, Chromium only.
- **Rationale**: Matches presenter browser; proves arrows + section order end to end.
