# Data Model: Visual PRs (spec 009)

## Shot folder

The output of `slide-shots.mjs`: `<dir>/NNN.png`, one per slide, where NNN is the slide number padded to 3 digits.

## Manifest (`out/manifest.json`, written by `slide-diff.mjs`)

| Field | Type | Rule |
|---|---|---|
| `total` | integer | number of head slides |
| `baseMissing` | boolean | true when the base folder is missing or empty |
| `changes` | array | sorted by `slide` |
| `changes[].slide` | integer | 1..999 |
| `changes[].kind` | `changed` \| `new` \| `removed` | |

Images next to the manifest:
- `NNN-before.png` for `changed` and `removed`
- `NNN-after.png` for `changed` and `new`
- nothing else

## Stored images (`pr-assets` branch)

`pr-<number>/<head-sha>/NNN-(before|after).png`, append-only.

## Slide changes comment

Marker `## Slide changes`; body per [contracts/slide-changes-comment.md](contracts/slide-changes-comment.md).
