# Capability Map: Installable app shell

Status: map and module specs approved by the owner on 2026-11-26.

Follows Linear project P-UI-14 "App shell recipe", which built the basic shell in the docs app and is complete.

## Intent

- **Outcome:** an installable base app shell. One command turns an empty directory into a running multi-page Next.js app with a sidebar, breadcrumbs and a header, all driven by one nav config file the project owns.
- **User:** the owner starting a new product first. Then individuals and small to mid-sized teams, and their agents, who want to skip boilerplate. The docs app stays consumer number one, running an installed copy of the same recipe, with its sitemap expressed as that config.
- **Why now:** the shell is proven in the docs app but has one consumer and no way out of this repo. Using the library is the step after installing it.
- **Success:** a published command installs the recipe verbatim into a fresh Next.js app, a `uiid` skill tailors pages and nav, and the result passes lint, typecheck and a production build. Adding a page to the navigation means editing the config; the sidebar and breadcrumbs follow.
- **Constraint:** a strong, small base. Complexity is eased in afterwards, one layer at a time. The recipe stays many small files built from UIID components, with no `Sidebar` export from any `@uiid/*` package. Installed files belong to the project.

## Modules

| Module id         | Milestone | Responsibility                                                                                                                            | Depends on        |
| ----------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `shell-nav`       | 1 Base    | One nav config drives sidebar groups, top-level items and breadcrumb labels. The docs sitemap becomes that config.                        | —                 |
| `shell-boundary`  | 1 Base    | Recipe directories import nothing that belongs to the docs app. Docs content is passed in. The docs app stops loading Tailwind.           | `shell-nav`       |
| `recipes-package` | 2 Package | A private `packages/recipes` holds the recipe source and a manifest. The docs app runs a copy that a check keeps identical.               | `shell-boundary`  |
| `recipes-install` | 2 Package | A script copies a recipe into a Next.js app and wires it up. A fresh app in this repo is installed and built by it.                       | `recipes-package` |
| `recipes-repo`    | 3 Extract | The package moves to `uiid-systems/recipes` and is published with a `bin`. The fresh app and the docs app install from the published one. | `recipes-install` |
| `shell-start`     | 4 Skills  | A `uiid:start-project` skill: scaffold the app, run the published install command, ask for pages, write the nav config and routes.        | `recipes-repo`    |
| `shell-page`      | 4 Skills  | A `uiid:scaffold-page` skill: add a page to a project that has the shell, as a route file plus a nav config entry.                        | `recipes-repo`    |

Build order: `shell-nav` → `shell-boundary` → `recipes-package` → `recipes-install` → `recipes-repo` → `shell-start`, `shell-page`

Each module gets a spec beside this file: `spec/SPEC-<module id>.md`. Module ids do not change.

Owner look checkpoints:

- After `recipes-install`: the owner runs the script on an empty directory and uses the result. Extraction waits for this.
- Before `recipes-repo` creates the repository or publishes anything: both are public and hard to undo, so the owner confirms the repo name, the package name and the first version.

## What exists today (2026-11-26)

- The recipe is five directories in `apps/docs/components/`: `shell`, `sidebar`, `header`, `main`, `breadcrumbs`, composed in `apps/docs/app/layout.tsx`. Its structure rules are in `.claude/rules/recipes.md`.
- Recipe files import each other through the `@/components/...` alias, which a fresh Next.js app also defines. A verbatim copy keeps working.
- `sidebar.constants.ts` imports `COMPONENTS_SITEMAP` from the docs app's `sitemap.ts` and reshapes it. `sidebar.tsx` hard-codes the Home and Changelog items.
- `breadcrumbs.utils.ts` builds labels by title-casing URL segments. Page names therefore have two sources: the sitemap and the URL.
- `header/` holds the docs app's GitHub, npm and Storybook links, in `header.constants.ts` and `header-links.tsx`.
- `main/` takes an `aside`, which the docs app fills with its "on this page" list. That part is already passed in.
- Dependencies beyond React and Next.js: `@uiid/design-system`, `@uiid/icons`, `jotai`. Only `sidebar.hooks.ts` imports jotai.
- The layout wires an inline no-flash script, three sidebar constants and `ShellBody` by hand.
- The docs app uses no Tailwind class or directive, but still loads Tailwind in `globals.css`. Because Tailwind's reset sits in a cascade layer, `layout.tsx` must import `globals.css` before any UIID stylesheet or the reset outranks the library.

## Decisions carried into every module

- **The package is the source of truth.** From `recipes-package` on, recipe source is edited in the package. The docs app holds a copy that must match it byte for byte, enforced by a check, and refreshed by an internal sync command. This is the one consumer that stays in sync; it is the recipe's development host.
- **Verbatim copy.** The install script never rewrites recipe source. Anything a project must change lives in a file the recipe reads (the nav config) or is passed in as a prop or child. This is also what lets the docs copy stay identical.
- **The package ships source, not components.** Nothing imports recipe code from `@uiid/recipes`. It exports no React component.
- **No Tailwind.** The recipe uses none, the docs app drops it in `shell-boundary`, and the fresh app is scaffolded without it. Nothing in the recipe or its wiring depends on stylesheet import order. The removal is checked with a before and after pixel comparison of the docs pages.
- **Next.js App Router only.** `next/link` and `next/navigation` stay in the recipe.
- **No update path for projects.** Once installed, files are the project's. Running the install on a project that has them is refused, not merged.
- **Nav config is plain data, one level of groups.** Labels and hrefs, with groups of items. No icons, badges, permissions or nesting in the base.
- **Private until extraction.** `packages/recipes` is unpublished and outside release-please while it lives here. Publishing starts in the new repo, which needs its own npm trusted publisher set up first.
- **Conventions:** `.claude/rules/recipes.md`, `components.md` and `styling.md` apply as they do today. Checks are the ones in `.claude/uiid.yml`, plus `pnpm run build --filter=docs`.

## Shared conventions

Every module spec inherits this section and states only what differs.

### Tech stack

Next.js 16 App Router, React 19, TypeScript 7, `@uiid/design-system`, `@uiid/icons`, jotai 3, CSS Modules in pure mode. The install script is dependency-free Node ESM with no build step. Tests run on Vitest from the repo root.

### Commands

```
Install:        pnpm install
Unit tests:     pnpm test:run packages/recipes
Typecheck:      pnpm typecheck
Lint:           pnpm run lint
Format check:   pnpm run format:check
Build docs:     pnpm run build --filter=docs
Docs dev:       pnpm --filter docs dev
Copy check:     pnpm recipes:check        (from recipes-package on)
Copy refresh:   pnpm recipes:sync         (from recipes-package on)
Fresh app:      pnpm recipes:verify       (from recipes-install on)
```

### Project structure

```
apps/docs/components/{shell,sidebar,header,main,breadcrumbs}/   the recipe today; a checked copy from recipes-package on
apps/docs/lib/nav.ts                                            nav types and pure helpers (recipe file, from shell-nav)
apps/docs/nav.ts                                                the docs app's own nav config (project file)
apps/docs/components/docs/                                      docs-only components; never part of the recipe
packages/recipes/                                               private package, from recipes-package on
  src/                                                          the install script and its tests
  app-shell/recipe.json                                         the manifest
  app-shell/files/                                              copied verbatim; paths are relative to the project root
  app-shell/templates/                                          written once into a new project, then the project's to edit
spec/                                                           this map and the module specs
```

### Code style

`.claude/rules/recipes.md`, `components.md` and `styling.md`, unchanged. The rule this project adds: a recipe file reaches project content only through `@/nav` or through props and children.

```tsx
// components/sidebar/sidebar.tsx: content comes from the project's config
import { NAV } from "@/nav";
import { findActiveItem } from "@/lib/nav";

// app/layout.tsx: anything else the project wants is passed in
<Shell sidebar={<Sidebar title="Acme" />} header={<Header>{actions}</Header>}>
```

A recipe file may import only: `react`, `next/*`, `jotai`, `@uiid/design-system`, `@uiid/icons/*`, `@/nav`, `@/lib/nav`, and other recipe directories through `@/components/...`.

### Testing strategy

- **Pure helpers** (`lib/nav.ts`, the install script): unit tests on Vitest. Script tests run against temporary directories.
- **The recipe in an app:** the docs app has no test runner. Behavior is proven by `pnpm run build --filter=docs`, `pnpm typecheck`, and a headless Playwright script against the running app for anything visual or stateful (Playwright is already installed).
- **The install path:** `pnpm recipes:verify` builds a fresh app end to end. It is the acceptance test for milestones 2 and 3.

### Boundaries

- **Always:** read a UIID component's `.types.ts` before using it; keep both copies of a recipe file identical; run lint, format check, typecheck and the docs build before opening a PR; fix a design system gap in the package that owns it, in its own PR.
- **Ask first:** adding a dependency to the recipe; changing a workflow file under `.github/`; changing `.claude/uiid.yml`; creating a repository, publishing to npm or pushing a tag; anything that widens the nav config beyond labels, hrefs and one level of groups.
- **Never:** export a recipe component from a `@uiid/*` package; have the install script rewrite recipe source or overwrite a file that exists; add Tailwind; add a feature from the deferred list; add AI attribution to commits or PRs.

## Out of scope (deferred)

- An MCP server for recipes.
- Frameworks other than Next.js.
- Making the design system safe to load beside Tailwind in any import order. That is a library concern, not the recipe's.
- Mobile, icon rail, hotkey toggle, user menu and sidebar footer.
- Other shell, navigation or breadcrumb variants, and any way to choose between them.
- Updating or diffing files that a project already installed.
- A second recipe. The package and manifest are shaped by this one only.

## Open questions

1. After extraction, where is the recipe developed? Proposed: the fresh app moves to the recipes repo as its demo app, and the docs app becomes an ordinary pinned consumer. `recipes-repo` decides.
