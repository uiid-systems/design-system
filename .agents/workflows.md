# Pull Requests & Releases

PR titles follow **conventional commits**, enforced by CI. `.github/workflows/pr-title.yml` is the source of truth for allowed types. Use imperative mood ("add X", not "added X"), and keep titles concise — the squash-merged title becomes the changelog entry.

Descriptions should use bullet points, call out breaking changes explicitly, and link issues with `Closes #123`. Write custom, verifiable checklist items rather than boilerplate — each box should be something an agent can confirm by reading the diff or running a command.

Versioning and changelogs are automated by **release-please**:

- All `@uiid/*` packages share one version, kept in sync via `extra-files`
- **Pre-1.0.0, bumps are patch-only** (`bump-patch-for-minor-pre-major`) — breaking changes bump minor, never major
- `feat` and `fix` trigger a release; `docs`, `chore`, `ci`, `test`, and `refactor` are recorded but do not force one
