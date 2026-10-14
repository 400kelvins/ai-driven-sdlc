# understand-gate

No yes without understanding: human review gates for AI-written code.

Early work in progress. Today it computes a fingerprint per scope; the ledger, the CI check, and the
installer follow (see the architecture spine in this repo).

## Command

```sh
understand-gate fingerprint --scope <name>
```

Prints a 16-character fingerprint of the files in that scope: the committed files, plus any
uncommitted, new, or deleted files in it. Exit codes: 0 pass, 1 failure, 2 usage.

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
