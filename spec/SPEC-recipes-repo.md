# Spec: recipes-repo — V1

Milestone 3. Inherits the shared conventions in `spec/capability-map-app-shell.md`. Starts after the owner has run `recipes-install` on an empty directory and approved the result.

## Objective

Recipes become their own concern. The package moves to a public `uiid-systems/recipes` repository, is published to npm so `npx` can run it anywhere, and this repo goes back to being a consumer: the docs app runs a pinned copy, and a fresh project is installed from the published package and built here.

## Current behavior this spec changes

- `packages/recipes` is private and lives in this monorepo.
- The install script runs only from a checkout of this repo.
- The docs app's copy is checked against a sibling directory.

## Owner checkpoint before any public step

Creating the repository, publishing the first version and pushing tags are public and hard to undo. Before the first of them, the owner confirms: the repository name (`uiid-systems/recipes`), the npm package name (`@uiid/recipes`), the command name (`uiid-recipes`), and the first version (proposed `0.1.0`). An agent prepares everything up to that point and stops.

## Requirements

1. The new repository is set up the way `uiid-systems/skills` is: `AGENTS.md`, conventional-commit PR titles, CI, release-please, oxfmt, a `spec/` directory, the MIT license.
2. `packages/recipes` moves in whole: the script, its tests, `app-shell/`, the README. The first commit names the design-system commit it was taken from.
3. The recipes repo has a committed demo app, a Next.js app whose recipe files are a checked copy of `app-shell/files/`, as the docs app's were. It is where the recipe is developed and seen. `recipes:sync`, `recipes:check` and `recipes:verify` work there against it.
4. The recipes repo's CI runs the unit tests, `recipes:check` and `recipes:verify` on every pull request.
5. `@uiid/recipes` is published with the `uiid-recipes` bin and the recipe directories in its tarball. It is versioned on its own, apart from the shared `@uiid/*` version. Publishing uses npm trusted publishing from the new repo's release workflow, set up before the first release.
6. `npx @uiid/recipes create <dir>` and `npx @uiid/recipes add app-shell` behave exactly as the in-repo commands did.
7. In this repo, `packages/recipes` is deleted along with its exemption in the registration check and its entry in the `.claude/uiid.yml` allowlist.
8. The docs app depends on `@uiid/recipes` at an exact version as a dev dependency. `pnpm recipes:check` and `pnpm recipes:sync` stay in this repo as thin scripts that compare and copy against that installed version. Moving to a newer recipe is a version bump plus a sync, in one PR.
9. `pnpm recipes:verify` stays in this repo and runs the published command at the pinned version into a git-ignored directory, then builds and checks the app as before. This is the fresh-project test against the real package.
10. `AGENTS.md`, `.claude/rules/recipes.md` and the root `README.md` point at the recipes repo as the place recipe source is edited, and say that a recipe change needing a library change waits for a design system release.
11. The first published version is installed and built by `recipes:verify` in this repo before the PR that deletes `packages/recipes` merges.

## Testing strategy

- In the recipes repo: the moved unit tests, `recipes:check` against the demo app, `recipes:verify`.
- In this repo: `recipes:check` against the installed package, `recipes:verify` against the published command, and the docs build.
- By hand, once, by the owner: `npx @uiid/recipes create` in a directory outside any checkout.

## Success criteria

- [ ] `npm view @uiid/recipes version` returns the first version.
- [ ] `npx @uiid/recipes create <dir>` outside any checkout produces an app that builds.
- [ ] In this repo, `ls packages/recipes` fails and `git grep -n "packages/recipes"` returns nothing outside `CHANGELOG.md` and `spec/`.
- [ ] In this repo, `pnpm recipes:check`, `pnpm recipes:verify`, `pnpm typecheck` and `pnpm run build --filter=docs` pass.
- [ ] `diff -r` between the published package's `app-shell/files/components` and `apps/docs/components` for the five recipe directories is empty.

## Out of scope (deferred)

- Moving this project's specs into the recipes repo. They stay here as the record of how it was built.
- A registry, a website or a listing of recipes.
- A second recipe.
- Keeping the git history of individual recipe files.

## Open questions

1. Should this repo also keep a committed starter app, built against `workspace:*` packages, so a library change that breaks the shell fails here before release? It would catch regressions earlier than the pinned copy in the docs app does, at the cost of a third copy of the recipe. Proposed: no, the docs app already runs the recipe against workspace packages.
