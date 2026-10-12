# Data Model: Deck Scaffold

- **Section** — `name` (intro | talk | demo | monitor | behind | retro | links), `file` (`pages/<name>.md`),
  `title` (placeholder heading), `owner_story` (BMad Story id). Order fixed as listed. One file per Section.
- **Slide** — belongs to exactly one Section; first slide of each Section is its title slide.

No persisted data; no state transitions beyond current slide index (0..N-1, clamped).
