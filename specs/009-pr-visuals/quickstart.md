# Quickstart: validate visual PRs (spec 009)

## Local

1. Run `npm run dev`, then in another terminal `npm run shots -- http://localhost:3030 /tmp/a`. Expect 21 PNGs.
2. Run it again into `/tmp/b`, then `node scripts/slide-diff.mjs /tmp/a /tmp/b /tmp/out`. Expect `0 changed`.
3. Edit one slide's wording, then shoot into `/tmp/c` and diff `/tmp/a` against `/tmp/c`. Expect `1 changed`, with `NNN-before.png` and `NNN-after.png`.
4. Run `npm run test:unit`. Expect it to pass.

## On GitHub

1. Open this Story's PR. Expect a `## Slide changes` comment reading "No slide changed", and an AI review that opens with a diagram.
2. Open a throwaway PR from it that changes one slide's wording. Expect exactly that slide's before/after pair inline. Close it without merging.
3. Run `git ls-tree -r origin/main --name-only | grep -c '^pr-'`. Expect `0`.
4. Run `npm run pr:review`. Expect the AI review and the slide changes in the output.
