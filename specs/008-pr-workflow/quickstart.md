# Quickstart: validating the PR workflow (spec 008)

## Prerequisites (human, one time)

1. `gh auth refresh -h github.com -s workflow`: allows pushing workflow files.
2. `claude setup-token`, then `gh secret set CLAUDE_CODE_OAUTH_TOKEN -R 400kelvins/ai-driven-sdlc`:
   paste the token at the prompt, not in chat.

## Local

```sh
npm run test:unit            # includes pr-review and workflow-shape tests
npm run verify
```

## On GitHub, using this Story's own PR

| Step | Expected |
|---|---|
| Push the branch, open the PR with "Closes #1" | `verify` runs; `human-gate` **fails** ("code changed since the review gate…") |
| Wait for the AI review | Comment `## AI code review` appears on the PR |
| `npm run pr:review` | Prints the PR link and that comment |
| Apply branch protection | PR shows "Merging is blocked"; `git push origin main` from local is rejected |
| Review gate yes → `docs:` commit pushed | `human-gate` turns green; merge allowed |
| Merge | Issue #1 closes |
| Optional: touch a shipped file on the branch before merge | `human-gate` fails again |
| After merge: `git pull && npm run ship` | Gate passes on `main`; deploy plus log check |
