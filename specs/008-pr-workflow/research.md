# Research: PR Workflow (spec 008)

## R1. How the human gate becomes enforceable on GitHub

- **Decision**: A required status check `human-gate` runs `npm run gate:check` (the latest review
  decision must be yes and match the shipped-code fingerprint).
- **Rationale**: GitHub forbids authors from approving their own PRs, and the presenter is the only
  human. The gate log already ties the yes to the exact code.
- **Alternatives**: required PR approvals (impossible for a solo author); a second GitHub account
  (fake review, against the talk's honesty); CODEOWNERS (needs an approver too).

## R2. Which commit the gate check fingerprints

- **Decision**: Check out `github.event.pull_request.head.sha` for `human-gate`, not the default
  merge ref. On pushes to `main`, use the pushed commit.
- **Rationale**: The human approved the branch as it stands. A merge ref with a moved `main` would
  produce a different fingerprint. Strict protection ("branch up to date") means the merged tree
  equals the approved tree anyway.
- **Alternatives**: the merge ref (fingerprint drifts whenever `main` moves).

## R3. Recording a yes without invalidating it

- **Decision**: Keep the current fingerprint rules. `_bmad-output/`, `specs/`, `.specify/`,
  `.claude/` and other Markdown are excluded, so the `docs: review gate yes` commit leaves the
  fingerprint unchanged. CI re-runs on that push and `human-gate` turns green.
- **Alternatives**: a commit-status API call from the laptop (bypasses the ledger, so it is not
  auditable in the repo).

## R4. AI reviewer authentication and identity

- **Decision**: Use `claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}` (from
  `claude setup-token`), plus `github_token: ${{ secrets.GITHUB_TOKEN }}` with
  `pull-requests: write`, so no Claude GitHub App install is needed. Comments post as
  `github-actions[bot]`.
- **Rationale**: Fewest human steps; the token never leaves GitHub secrets.
- **Unverified**: whether a subscription OAuth token is billed to the plan. This is noted for the
  retrospective.
- **Alternatives**: `ANTHROPIC_API_KEY` (pay per use; the presenter prefers the subscription);
  the Claude GitHub App (an extra install step).

## R5. Missing secret and forks

- **Decision**: The job runs only when the PR head repo is this repo. A first step checks whether
  the secret is set and, if not, skips the review step with a notice. The job is not a required
  check.
- **Rationale**: Forks can't read secrets. An outage must not block the human decision (FR-005).

## R6. Action versions

- **Decision**: `actions/checkout@v7.0.1` (2026-07-20), `actions/setup-node@v7.0.0` (2026-07-14),
  `anthropics/claude-code-action@v1.0.237` (2026-09-29).
- **Rationale**: Each was released at least 2 weeks before the talk date, per project practice.
  Newer releases (setup-node v7.1.0, claude-code-action v1.0.249) are too recent.

## R7. Does merging deploy?

- **Decision**: No change. The Vercel project has no git link (`link: null` from the Vercel API), so
  merges never deploy. `npm run ship` on `main` after merge stays the only deploy path, and it
  re-checks the gate.

## R8. Pushing workflow files

- **Finding**: The local `gh` token has scopes `gist, read:org, repo`. GitHub rejects pushes that
  add `.github/workflows/*` without the `workflow` scope.
- **Decision**: The human runs `gh auth refresh -h github.com -s workflow` before the first push.

## R9. Branch protection settings

- **Decision**: Set through `PUT repos/400kelvins/ai-driven-sdlc/branches/main/protection`:
  - `required_status_checks: { strict: true, contexts: ["verify", "human-gate"] }`
  - `enforce_admins: true`
  - `required_pull_request_reviews: null`
  - `restrictions: null`
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **When**: After this PR's checks have run once, so the check names exist, and before merge. This
  PR is then the first change to pass through it.
- **Consequence**: From then on, gate-record commits and `content:` edits reach `main` only by PR.

## R10. Live finding: subscription token rejected (2026-10-14)

- **Finding**: On PR #2 the reviewer failed with `API Error: 400 This API key is not scoped to a
  workspace, so this request must include the anthropic-workspace-id header`. The `setup-token`
  OAuth token came from an organization login that requires a workspace.
- **Decision (presenter)**: Use a Console API key as the secret `ANTHROPIC_API_KEY`, passed as
  `anthropic_api_key`. It is billed per use, and it supersedes R4's OAuth choice. The old
  `CLAUDE_CODE_OAUTH_TOKEN` secret is no longer used.
