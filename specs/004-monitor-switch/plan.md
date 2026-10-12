# Implementation Plan: Switch to Live Monitoring and Back

**Branch**: `004-monitor-switch` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

## Technical Context
Slidev `setup/shortcuts.ts` via `defineShortcutsSetup`, appending a shortcut that finds the slide with frontmatter `monitor: true` (no routeAlias, so URLs stay numeric). Content in pages/monitor.md. Playwright `tests/monitor.spec.ts`.

## Constitution Check (v1.1.0)
I no hand-written code ✅ · II traces to Story 4 ✅ · III Gate Review Pack ✅ · IV local-first ✅ · V Slidev built-ins first ✅ · VI offline ✅

## Complexity Tracking
None.
