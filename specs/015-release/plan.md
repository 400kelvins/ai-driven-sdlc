# Implementation Plan: Release Script and read-listen-see Alias

**Branch**: `015-release` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

## Summary

| Part | What |
|---|---|
| Script | `packages/understand-gate/scripts/release.mjs` (not published); `npm run release -w understand-gate -- prepare <bump>` / `tag` |
| prepare | checks main, clean, `HEAD == origin/main` (after fetch); bumps both `package.json` versions and the alias dependency; branch `release/understand-gate-<v>`; commit `release: understand-gate@<v>` |
| tag | checks main, clean, versions in step, no tag, `node --test` passes, package review yes via the library (`approval` + `fingerprint`); `npm pack --dry-run --json -w understand-gate` file list; `git tag -a`; prints `git push origin understand-gate@<v>`, `npm publish -w understand-gate`, `npm publish -w read-listen-see` |
| Alias | `packages/read-listen-see/{package.json, bin/read-listen-see.mjs, README.md, LICENSE}`; bin resolves `understand-gate/bin/understand-gate.mjs` and runs it with the same args and exit code |
| Publishing fields | both: `files`, `license: MIT`, `repository {url, directory}`, `keywords`; understand-gate `files: [bin, src, README.md, LICENSE]` |
| Scope | `package` include adds `packages/read-listen-see/**` |
| Tests | `packages/understand-gate/tests/release.test.mjs` on throwaway repos with a bare origin; alias test; a test that the script never calls publish or push |

## Constitution Check

| Principle | Status |
|---|---|
| I. No hand-written code | ✅ |
| II. Spec is source of truth | ✅ Story 2.5, issue #20, spec 015 |
| III. Humans at the gates | ✅ the human publishes (AD-10) |
| IV. Local-first | ✅ |
| V. Simplicity | ✅ one script, two steps, no dependencies |
| VI. Offline-safe | ✅ |
