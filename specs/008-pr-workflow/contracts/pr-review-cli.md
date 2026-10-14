# Contract: `npm run pr:review -- [<pr-number>]`

- No argument: uses the open PR for the current branch (`gh pr view`).
- Output (stdout, Markdown):
  - `**PR**: #<n> <url>`, then the newest comment whose body starts with `## AI code review`, with
    that heading demoted to `###` so it nests under the pack's own section.
  - With no such comment: `**PR**: #<n> <url>` and `_No AI review comment yet._`
  - With no PR for the branch: `_No pull request for this branch._`
- Exit code 0 in all three cases. It exits non-zero only when `gh` itself fails (not installed or not
  signed in), with the `gh` error on stderr.
- Exported pure function `latestReview(comments)` → body string or `null`, for unit tests.
