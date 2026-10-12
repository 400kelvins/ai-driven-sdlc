# Implementation Plan: Embedded Offline Demo Video

**Branch**: `005-demo-video` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

## Technical Context
Small Vue component `components/DemoVideo.vue` (video + error fallback) used in pages/demo.md; `public/demo/README.md` with ffmpeg compression command. Test serves a generated 1-second fixture via Playwright route (no fake demo committed). Playwright `tests/demo.spec.ts`.

## Constitution Check (v1.1.0)
I no hand-written code ✅ · II traces to Story 5 ✅ · III Gate Review Pack ✅ · IV local-first ✅ · V Slidev built-ins first ✅ · VI offline ✅

## Complexity Tracking
None.
