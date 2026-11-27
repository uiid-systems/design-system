# Spec: recipes-package — V1

Milestone 2. Inherits the shared conventions in `spec/capability-map-app-shell.md`. Starts after `shell-boundary`.

## Objective

The recipe has a home that is not an app. A private `packages/recipes` owns the app shell's source and a manifest describing it, and the docs app runs a copy that a check keeps identical. This rehearses, inside one repo, the relationship the recipes repository will have with its consumers.

## Current behavior this spec changes

- The only copy of the recipe is in `apps/docs/`.
- Nothing records which files are the recipe, what it depends on, or what a project must add to use it.
- `packages/config/scripts/check-package-registration.mjs` treats every `packages/*` folder except `config` as a built component package.
- `pnpm typecheck` globs `packages/*/src`.
- `.claude/uiid.yml` lets a build run push `packages/*/src/**` and `packages/*/README.md` only.

## Requirements

1. `packages/recipes/package.json` is named `@uiid/recipes`, is `"private": true`, and has no build script, no `exports` and no dependencies. It is not added to `release-please-config.json` or the root `tsconfig.json` references.
2. The package registration check treats `recipes` as it treats `config`: not a component package. The change is a named exemption with a comment saying why.
3. Recipe source lives in `packages/recipes/app-shell/files/`, laid out as it lands in a project: `components/shell/`, `components/sidebar/`, `components/header/`, `components/main/`, `components/breadcrumbs/`, `lib/nav.ts`. It is outside `src/` so the package typecheck never compiles it.
4. `packages/recipes/app-shell/recipe.json` is the manifest. It states the recipe's name and one-line description, the npm dependencies it needs with version ranges, and the templates with their destinations. It does not list the files: everything under `files/` is the recipe.
5. `packages/recipes/app-shell/templates/` holds what a new project gets once and then owns: a starter `nav.ts`, `app/layout.tsx`, `app/globals.css` and the starter pages the nav points at. The docs app does not use the templates.
6. `pnpm recipes:sync` copies `files/` over the same paths in `apps/docs/`, removing files in those directories that the recipe no longer has. `pnpm recipes:check` exits non-zero and names each file that differs, is missing or is extra. Both are plain Node scripts in `packages/recipes/src/`.
7. `recipes:check` also fails when a file under `files/` imports anything outside the allowed list in the map's code style section.
8. `pnpm recipes:check` joins the checks in `.claude/uiid.yml`, and its push allowlist gains `packages/recipes/**`. The CI test workflow runs it. Both edits are flagged in the PR, per the map's boundaries.
9. Lint and format cover both copies. The recipe is typechecked through the docs copy; the PR states that in the package README.
10. `packages/recipes/README.md` documents the manifest format, the two directories, the sync and check commands, and the rule that the package is where recipe source is edited.
11. `.claude/rules/recipes.md` is updated: its `paths:` cover `packages/recipes/*/files/**`, the exemplar pointer names the package, and it says the docs copy is never edited directly.
12. The move itself changes no recipe file's contents. `git diff --stat` for the recipe directories in `apps/docs/` is empty in the PR that adds the package.

## Testing strategy

- Unit tests for sync and check against temporary directories: identical trees pass; a changed, missing and extra file each fail and are named; a disallowed import fails; sync makes a failing tree pass.
- `pnpm recipes:check` on the PR branch is the integration test.

## Success criteria

- [ ] `pnpm recipes:check` passes on a clean checkout.
- [ ] Editing one character in `apps/docs/components/sidebar/sidebar.tsx` makes `pnpm recipes:check` fail and name the file; `pnpm recipes:sync` restores it.
- [ ] `node packages/config/scripts/check-package-registration.mjs` passes.
- [ ] `pnpm test:run packages/recipes`, `pnpm typecheck`, `pnpm run lint`, `pnpm run format:check` and `pnpm run build --filter=docs` pass.
- [ ] `git grep -n "@uiid/recipes" packages/*/package.json apps/*/package.json` shows the package's own name only.

## Out of scope (deferred)

- A second recipe, or manifest fields a second recipe might want.
- Watching for changes and syncing on save.
- Copying from the docs app back into the package.
- Publishing. The package stays private until `recipes-repo`.

## Open questions

None.
