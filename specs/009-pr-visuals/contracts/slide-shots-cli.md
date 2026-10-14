# Contract: slide scripts

```text
node scripts/slide-shots.mjs <deck-url> <out-dir>
```
- Writes `<out-dir>/NNN.png` for every slide of the running deck at `<deck-url>`, fully revealed, 1280×720.
- Prints the slide count. Exits non-zero if the deck does not load.

```text
node scripts/slide-diff.mjs <base-dir> <head-dir> <out-dir>
```
- Writes `<out-dir>/manifest.json` (see data-model.md) and copies only the images it lists.
- A missing or empty `<base-dir>` means `baseMissing: true`, and every head slide is `new`.
- Exits 0. Prints `N changed`.

`npm run shots -- <deck-url> <out-dir>` is an alias for `slide-shots.mjs`.
