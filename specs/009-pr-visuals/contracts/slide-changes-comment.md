# Contract: the `## Slide changes` PR comment

Posted only by `github-actions[bot]` and updated in place.

```markdown
## Slide changes

_Commit abc1234 · 2 of 21 slides changed._

| Slide | Before | After |
|---|---|---|
| 4 | ![before](<url>/004-before.png) | ![after](<url>/004-after.png) |
| 22 | — | ![after](<url>/022-after.png) |

_+3 more changed (only the first 10 are shown)._
```

Variants:
- **No change:** `_Commit abc1234 · No slide changed._`
- **Base missing:** an extra line, `_Before images missing: the base did not build._`
- **Fork:** no comment is posted; there is a workflow warning instead.
- **Failure:** `_Screenshots could not be made: see the workflow run._`

`<url>` = `https://raw.githubusercontent.com/<owner>/<repo>/pr-assets/pr-<n>/<sha>`
