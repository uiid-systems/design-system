# Pull Request Conventions

## PR Titles

PR titles must follow **conventional commit** format. This is enforced by CI (`pr-title.yml`).

```
type(scope): description
```

### Allowed types

| Type       | Use when...                                      |
| ---------- | ------------------------------------------------ |
| `feat`     | Adding new functionality                         |
| `fix`      | Fixing a bug                                     |
| `refactor` | Restructuring code without changing behavior     |
| `perf`     | Improving performance                            |
| `docs`     | Documentation-only changes                       |
| `chore`    | Maintenance (deps, configs, scripts)             |
| `test`     | Adding or updating tests                         |
| `ci`       | CI/CD workflow changes                           |

### Rules

- **Scope** is optional but encouraged for package-specific changes (e.g., `feat(buttons): add icon support`)
- Use **imperative mood** — "add X" not "added X" or "adds X"
- Keep it **concise** — the title feeds directly into changelogs via auto-changeset

## PR Descriptions

### What to include

- **Summary** — what changed and why, in a few bullet points
- **Breaking changes** — call these out explicitly if present
- **Issue references** — link related issues with `Closes #123` or `Fixes #123` to auto-close them on merge

### Formatting

- Prefer **bullet points** over paragraphs for scannability
- Keep it brief — the diff tells the full story

## Authorship

**Never add yourself or any AI agent as a co-author of a PR or commit.** Do not include `Co-Authored-By` trailers or attribute work to an AI in any authorship metadata. The human is the sole author of all contributions — they own the code, the decisions, and the accountability. AI is a tool, not a collaborator of record.

## Checklists and AI-Assisted Review

PR authors write **custom checklist items** in the PR description as review criteria. These are specific, verifiable assertions about the changes — not boilerplate.

### Writing good checklist items

Each checkbox should be something an agent can verify by reading the diff, running a command, or inspecting the codebase. Be specific:

- **Good:** `- [ ] New component exports are added to src/index.ts`
- **Good:** `- [ ] No hardcoded color values — all colors use design tokens`
- **Bad:** `- [ ] Code looks good`
- **Bad:** `- [ ] Ready for review`

### Agent review workflow

When asked to review a PR against its checklist:

1. Read the PR description and extract all checkbox items
2. Read the PR diff and any relevant files in the codebase
3. Verify each item against the actual changes
4. Check the box on the PR description for each verified item
5. Leave a review comment summarizing what was verified and flagging anything that couldn't be confirmed

If an item **cannot be verified** (e.g., it requires manual testing or subjective judgment), leave the box unchecked and note the reason in the review comment.

### Rules

- **All boxes must be checked** before the PR is considered ready for merge
- If something isn't done yet, remove the checkbox or convert it to a follow-up issue — don't leave unchecked boxes lingering
- The review comment should be concise and reference specific files/lines where relevant
