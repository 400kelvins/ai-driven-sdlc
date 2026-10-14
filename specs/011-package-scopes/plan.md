# Implementation Plan: Package Workspace and Per-Scope Fingerprints

**Branch**: `011-package-scopes` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

## Summary

| Part | What |
|---|---|
| Workspace | root `package.json` gains `"workspaces": ["packages/*"]`; new `packages/understand-gate/package.json` (ESM, `bin`, no dependencies) |
| Config | `.understand-gate/config.json` with scopes `deck` and `package` |
| Matcher | `src/scopes.mjs`: gitignore-style patterns (`*`, `**`, `!` re-include, last match wins), no dependencies |
| Fingerprint | `src/fingerprint.mjs`: per scope, same method as `scripts/gate.mjs` (HEAD tree lines + diff of changed + untracked contents), filtered by the scope |
| CLI | `bin/understand-gate.mjs fingerprint --scope <s>`; exit 0 / 1 / 2 |
| Tests | `packages/understand-gate/tests/*.test.mjs` with throwaway git repos; root `test:unit` also runs them |

## Scope config for this repo

```json
{
  "scopes": {
    "deck": {
      "include": ["**"],
      "exclude": ["packages/**", "_bmad-output/**", "_bmad/**", "specs/**", ".specify/**",
                  ".claude/**", ".agents/**", ".understand-gate/**", "**/*.md",
                  "!slides.md", "!pages/*.md", "!.specify/extensions.yml", "!.understand-gate/config.json"]
    },
    "package": { "include": ["packages/understand-gate/**"], "exclude": [] }
  }
}
```

The deck rule equals today's `isCode` in `scripts/gate.mjs`, plus the new config file as gate wiring.

## Technical Context

- **Language**: Node.js ≥ 20.12, ESM, built-ins only (`node:crypto`, `node:child_process`, `node:fs`).
- **Testing**: `node:test`; each test makes a temp git repo, so no test touches this repo's files.
- **Constraints**: `scripts/gate.mjs`, `gate:record`, `gate:check`, and CI stay untouched (FR-008).
- **Not in this story**: ledger, check, CI path filters, proof, release.

## Constitution Check

| Principle | Status |
|---|---|
| I. No hand-written code | ✅ AI writes it |
| II. Spec is source of truth | ✅ Story 2.1, issue #10, spec 011 |
| III. Humans at the gates | ✅ three gates; human merges |
| IV. Local-first | ✅ `npm run verify`, then PR |
| V. Simplicity | ✅ zero deps; one small matcher instead of a glob library |
| VI. Offline-safe | ✅ no network |

## Project Structure

```text
package.json                              # + workspaces, test:unit also runs package tests
.understand-gate/config.json              # scopes
packages/understand-gate/
  package.json  README.md
  bin/understand-gate.mjs                 # CLI
  src/scopes.mjs                          # load config, match patterns
  src/fingerprint.mjs                     # per-scope fingerprint
  tests/scopes.test.mjs  tests/fingerprint.test.mjs  tests/cli.test.mjs
```

## Complexity Tracking

No violations.
