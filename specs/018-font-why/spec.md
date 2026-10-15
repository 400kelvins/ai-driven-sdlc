# Feature Specification: Fjord One Font and a "Why I Built It This Way" Slide

**Feature Branch**: folded into `017-fear-slides` (presenter's choice) · **Created**: 2026-10-15 · **Fast track**: the talk is today.

**Input**: "can we change the font to Fjord One, it's available on google fonts. Also I want to give perspective on why I have slides created with this process is because i work in fintech and I can't share all the secrets so I came up with process how I architect the ai driven sdlc for company" — BMad Story 16, GitHub issue [#25](https://github.com/400kelvins/ai-driven-sdlc/issues/25).

## Requirements *(mandatory)*

- **FR-001**: All deck text uses Fjord One, except code, which stays monospace.
- **FR-002**: The font is bundled with the deck (SIL OFL, `@fontsource/fjord-one` 5.3.0); the deck makes no request to a font service, so it works offline.
- **FR-003**: Slide 2, "Why I built it this way": "I work in fintech. I can't show you our code. So I built the same process in the open, on this deck." No company name. Speaker notes in the presenter's voice.

## Success Criteria *(mandatory)*

- **SC-001**: 0 requests to fonts.googleapis.com or fonts.gstatic.com.
- **SC-002**: The title renders in Fjord One; code does not.
- **SC-003**: Talk stays within 20 minutes.

## Assumptions

- Fjord One has one weight (400); bold text is synthesized by the browser.
- Presenter tests that named slide 2 now name the new slide.
