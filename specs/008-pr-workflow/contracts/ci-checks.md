# Contract: CI checks on `main`

| Workflow | Job | Trigger | Required | Passes when |
|---|---|---|---|---|
| `ci.yml` | `verify` | PR to `main`; push to `main` | yes | `npm run verify` exits 0 |
| `ci.yml` | `human-gate` | PR to `main`; push to `main` | yes | `npm run gate:check` exits 0 at the PR head commit |
| `claude-review.yml` | `review` | PR opened, synchronize, reopened, ready_for_review | no | Posts or updates a comment starting `## AI code review`; skips with a notice for forks or a missing secret |

Rules:
- Secrets are referenced only as `${{ secrets.NAME }}`; no literal tokens.
- Every `uses:` is pinned to an exact version tag.
- Workflow permissions default to `contents: read`; only the review job adds `pull-requests: write`.
- Branch protection: required contexts `verify` and `human-gate`, strict, admins enforced, no force
  pushes, no deletions, no required approvals.
