# Implementation Plan: Presenter View with Notes, Clocks, and 20-Minute Countdown

**Branch**: `003-presenter-view` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

## Technical Context
Slidev headmatter: `duration: 20min`, `timer: countdown`, `presenter: dev`. Time-of-day via root `custom-nav-controls.vue` rendered only when `isPresenter` (Slidev renders custom nav controls in the presenter bar). Sample notes added to each section file. Playwright `tests/presenter.spec.ts`.

## Constitution Check (v1.1.0)
I no hand-written code ✅ · II traces to Story 3 ✅ · III Gate Review Pack ✅ · IV local-first ✅ · V Slidev built-ins first ✅ · VI offline ✅

## Complexity Tracking
None.
