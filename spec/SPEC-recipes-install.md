# Spec: recipes-install — V1

Milestone 2. Inherits the shared conventions in `spec/capability-map-app-shell.md`. Starts after `recipes-package`. The owner look checkpoint follows this module.

## Objective

A script takes a recipe from `packages/recipes` and puts it into a Next.js app, the same way every time, with no AI involved. One command creates a new app that already runs on the shell; another adds the shell to an app that exists. A verify command proves the first path end to end on a fresh app.

## Current behavior this spec changes

- There is no way to get the recipe into another project.
- The published `@uiid/design-system` is 0.9.0 (2026-11-18). The shell needs library work merged after that, starting with the horizontal `CollapsiblePanel` from #655.

## Requirements

1. The script is `packages/recipes/src/cli.mjs`, declared as the package's `bin` under the name `uiid-recipes`. It has no dependencies and needs no build.
2. `uiid-recipes add <recipe>` installs into the app in the current directory, or `--cwd <dir>`:
   - It refuses, writing nothing, unless the target has a `package.json` that depends on `next`, an `app/` directory at its root, and a `@/*` alias to `./*` in `tsconfig.json`. Each refusal says which condition failed.
   - It refuses, writing nothing, when any destination under `files/` already exists, and lists them.
   - It copies `files/` verbatim, writes the starter `nav.ts` if the project has none, and adds the manifest's dependencies with the project's package manager, detected from its lockfile.
   - It does not touch `app/layout.tsx`, `app/globals.css` or any page. It prints the layout wiring to add.
3. `uiid-recipes create <dir>` makes a new app:
   - It refuses when `<dir>` exists and is not empty.
   - It scaffolds with `create-next-app`, pinned to the major the recipe is built on, asking for TypeScript, the App Router, the `@/*` alias, no `src/` directory and no Tailwind. The exact flags are taken from the pinned version's own documentation when the script is written, not from memory.
   - It then runs the same steps as `add`, and because the app is known to be untouched, replaces `app/layout.tsx`, `app/globals.css` and `app/page.tsx` with the templates and writes the starter pages.
4. The starter is small: a home page and one group of two pages, each rendered with UIID components. The group has an `href` and a page of its own, so the sidebar, a group and a three-crumb trail are all visible on first run.
5. Every failure exits non-zero with one sentence saying what to do. A failure partway through `create` leaves the directory in place and says so.
6. `--dry-run` on either command prints what would be written and writes nothing.
7. `pnpm recipes:verify` runs `create` into a git-ignored directory in the repo that is not a workspace member, then in that app runs its lint script if the scaffold gave it one, `tsc --noEmit` and `next build`. It then starts the built app and, with headless Playwright, asserts: every starter nav item is in the sidebar; the nested starter page shows its group open, its item marked current and the right breadcrumb labels; the toggle hides the sidebar; the closed state survives a reload.
8. The fresh app depends on the published `@uiid/*` packages, as a stranger's would. A recipe change that needs an unreleased library change waits for that release. The manifest's version range for `@uiid/design-system` names the first release the shell works on.
9. The CI test workflow runs `pnpm recipes:verify` on pull requests that touch `packages/recipes/**`. The workflow edit is flagged in the PR, per the map's boundaries.
10. `packages/recipes/README.md` documents both commands, every refusal, and what a project owns afterwards.

## Testing strategy

- Unit tests against temporary directories for `add`: each refusal; a successful copy is byte-identical to `files/`; an existing `nav.ts` is kept; `--dry-run` writes nothing. Dependency installation and `create-next-app` are stubbed in unit tests.
- `pnpm recipes:verify` is the end-to-end test and uses the real scaffold and the real registry.

## Success criteria

- [ ] `pnpm recipes:verify` passes from a clean checkout.
- [ ] In the app it creates, adding one item to `nav.ts` and a matching `page.tsx` shows the page in the sidebar with the right breadcrumb, with no other edit.
- [ ] Running `add` twice in the same app refuses the second time and changes no file.
- [ ] `diff -r` between `packages/recipes/app-shell/files/components` and the created app's `components` is empty.
- [ ] The created app has no Tailwind dependency and no PostCSS config.
- [ ] `pnpm test:run packages/recipes`, `pnpm run lint` and `pnpm run format:check` pass.

## Out of scope (deferred)

- Apps with a `src/` directory, the Pages Router, or a different import alias.
- Editing a layout that already exists.
- Updating, repairing or removing an installed recipe.
- Prompts. The script takes arguments and flags only; asking questions is the skill's job.
- Running from npm. Until `recipes-repo`, the script runs from a checkout of this repo.

## Open questions

1. Which design system release is the first the shell works on? It must exist on npm before `recipes:verify` can pass, so a release is a prerequisite of this module. The owner decides when to cut it.
