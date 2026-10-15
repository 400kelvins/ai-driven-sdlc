# Feature Specification: Specs Not Prompts, BMad + spec-kit, and What a Gate Is

**Feature Branch**: `019-specs-gates` · **Created**: 2026-10-15 · **Fast track**: the talk is today.

**Input**: "I want to list benefits of spec driven development rather than prompt and using bmad for prd and spec-kit for development, also want to make people understand what is a gate here. it's the understanding point." — BMad Story 17, GitHub issue [#26](https://github.com/400kelvins/ai-driven-sdlc/issues/26).

## Requirements *(mandatory)*

- **FR-001**: Three slides right after "The new SDLC", in this order: "Specs, not prompts", "BMad for the PRD, spec-kit to build", "What is a gate?".
- **FR-002**: "Specs, not prompts" contrasts prompting with spec-driven work and lists the benefits: one source of truth, reviewed before code, repeatable, small focused tasks, traceable.
- **FR-003**: "BMad for the PRD, spec-kit to build" says BMad does the what and why (PRD, architecture, epics, stories) and spec-kit the how (spec, plan, tasks, implement).
- **FR-004**: "What is a gate?" says a gate is the point where the human shows they understand before the work moves on, and names the plan, code, and review gates.
- **FR-005**: Speaker notes on each; the talk stays within 20 minutes (now ~15.5).

## Success Criteria *(mandatory)*

- **SC-001**: 3 new slides in place; e2e test checks order and the gate definition.
