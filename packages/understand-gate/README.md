# understand-gate

No yes without understanding: human review gates for AI-written code.

Early work in progress. Today it fingerprints each scope, records decisions in a ledger, checks every
scope a branch touches, and reports quiz stats. CI wiring, proof of a human yes, and the installer
follow (see the architecture spine in this repo).

## Commands

```sh
understand-gate fingerprint --scope <name>
understand-gate record --scope deck,package --stage review --story 2.2 --decision yes \
  [--attempts 2] [--first-try no] [--confidence 4] [--note "why"]
understand-gate check --base origin/main     # every scope the branch touched
understand-gate check --all                  # every scope
understand-gate stats                        # first-try quiz rate, re-explanations, no count
```

- `fingerprint` prints a 16-character hash of the files in a scope: the committed files, plus any
  uncommitted, new, or deleted files in it.
- `record` appends one line per scope to `.understand-gate/gates.jsonl`. It refuses while a scope
  has uncommitted changes, so the yes covers what CI will see.
- `check` passes only when each scope's latest `review` line is `yes` and matches its fingerprint.
  A branch that touches no scope passes.
- Exit codes: 0 pass, 1 failure, 2 usage. Errors are one line on stderr.

## The ledger

One JSON object per line, appended, never rewritten. The latest line for a scope and stage decides.

```json
{"ts":"2026-10-15T08:00:00.000Z","scope":"deck","stage":"review","story":"2.2","decision":"yes",
 "fingerprint":"1afa3c26d4d4de6d","proof":null,"attempts":2,"firstTry":false,"confidence":4,"note":null}
```

`proof` is filled in by a later version. The ledger is never part of any scope.

## Scopes

Scopes live in `.understand-gate/config.json`:

```json
{
  "scopes": {
    "deck": { "include": ["**"], "exclude": ["packages/**", "**/*.md", "!slides.md"] },
    "package": { "include": ["packages/understand-gate/**"] }
  }
}
```

Patterns match the whole path from the repository root:

- `*` matches any characters except `/`; `**` matches across folders.
- A file is in a scope when it matches an `include` pattern and is not excluded.
- Excludes apply in order and the last match wins; `!pattern` brings a file back.

A file in no scope, such as a planning document, changes no fingerprint.

## In CI

The required `understand-gate` check runs on `pull_request_target`, so the workflow, the checker, and
the scope config all come from `main`. The pull request's head is checked out only as data:

```sh
node ../base/packages/understand-gate/bin/understand-gate.mjs check --base "$BASE_SHA"
```

Nothing from the pull request is installed or run, the token is read-only, and checkouts keep no
credentials. A pull request that edits the workflow, the checker, or the config is still judged by
main's copies; its edits apply only after it merges, which needs a yes for the scope they are in.

`understand-gate touched --base <ref>` prints the scopes a branch touched, one per line, so CI can
run only the tests for those scopes.

`verify` is not a trust boundary: it runs from the pull request's own workflow, so a pull request can
change which tests it runs. The gate is `understand-gate`. A scope config must already be on `main`
before `check --base` judges a branch; without one, the check refuses.

## Proof of a human yes

With `"proof": "comment"` and `"reviewers": [{ "login": "<github-login>", "id": <user id> }]` in the
config, a review yes counts only when a listed reviewer comments on the pull request with one line per
touched scope. Reviewers are matched by numeric user id (`gh api users/<login> --jq .id`), because
GitHub frees a renamed account's old login for anyone to claim:

```text
/understand-gate yes deck 1afa3c26d4d4de6d
```

The line must name the scope and its current fingerprint, so a code change after the comment needs a
new review and a new comment. Comments from bot accounts never count. CI reads the proof settings from
`main`, like the scopes, so a branch cannot switch proof off. Posting, editing, or deleting a yes line
re-runs the check (`understand-gate-rerun.yml`, only for owners and collaborators). A re-run reuses the
original run's event, so a config change on `main` applies from the pull request's next push.
`check --all` reads the working tree's config and is for local use only; CI uses `check --base`.

**What it proves, and what it does not.** The comment shows the human's decision on the pull request,
where anyone can see it. It does not stop an agent that uses the reviewer's own GitHub login: GitHub
shows that agent's comment under the same name. For a yes the agent cannot produce, give the agent its
own GitHub account and require the reviewer's approval (a later mode).

Known limit: a pull request could add its own job named `understand-gate`.

## Release (maintainers)

`main` is protected, so a release has two steps, and a human always publishes:

```sh
npm run release -w understand-gate -- prepare minor   # clean main → release branch, both packages bumped
# open a pull request for that branch; gates, your yes comment, merge
npm run release -w understand-gate -- tag             # on main: tests, package yes, file list, tag; then stops
```

`tag` prints the commands to push the tag and run `npm publish` for `understand-gate` and its alias
`read-listen-see`. It never pushes or publishes.
