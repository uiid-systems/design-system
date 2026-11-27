# @uiid/recipes

Recipe source for UIID. A recipe is a set of app files built from UIID components, such as an app shell with a sidebar, a header and a main area. A project gets a recipe by copying its files, not by importing them: nothing imports from `@uiid/recipes`, and it exports no component.

The package is private and is not published or versioned with the `@uiid/*` component packages.

## Edit recipe source here

This package is where recipe source is edited. The docs app runs a copy of the app shell in `apps/docs/components/{shell,sidebar,header,main,breadcrumbs}/` and `apps/docs/lib/`, and that copy must stay byte for byte identical to `app-shell/files/`. Make a change here, then run `pnpm recipes:sync`. Never edit the docs copy on its own.

## Sync and check

Two commands, run from the repo root, keep the docs copy identical. Both are dependency-free Node scripts in `src/`: Node runs the TypeScript directly by stripping its types, so there is no build step.

- `pnpm recipes:sync` copies `app-shell/files/` over the same paths in `apps/docs/`: it writes each file that differs or is missing and deletes each extra file. It runs one way only, from this package to the docs app.
- `pnpm recipes:check` exits non-zero and prints one line per problem: each docs file that is `changed`, `missing` or `extra`, and each `import` in a recipe file that is not on the allowed list. Run `pnpm recipes:sync` to fix the first three; a disallowed import is fixed in the recipe.

What counts as the recipe's comes from what exists under `files/`, so a file or directory added to the recipe is covered without editing the scripts. The rule: the recipe owns each topmost directory under `files/` that directly holds a file. Today that is `components/shell`, `components/sidebar`, `components/header`, `components/main`, `components/breadcrumbs` and `lib`. The docs copy of an owned directory is wholly the recipe's, subdirectories included: a file in it that the recipe does not have is extra, and sync deletes it, along with any directory that leaves empty. A directory the recipe only passes through, such as `components/` or the app root, is never owned, so `apps/docs/components/docs/`, `apps/docs/nav.ts` and `apps/docs/nav.test.ts` are never reported or touched. A file directly under `files/` would be compared and copied on its own, without owning the root. A directory that holds no file owns nothing, so removing a whole directory from the recipe leaves its docs copy in place to delete by hand.

The allowed imports are the list in `.claude/rules/recipes.md`. A recipe file may import `react`, `jotai` and `@uiid/design-system`, bare or through their own subpaths (`react/jsx-runtime`, `jotai/vanilla/utils`, `@uiid/design-system/utils`); `next` and `@uiid/icons` through a subpath only (`next/link`, `@uiid/icons/panel-left`); `@/nav` and `@/lib/nav`; `@/components/<dir>` and its subpaths when `components/<dir>` is a recipe directory; and a relative path that stays inside the file's own recipe directory. The check reads every `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs` and `.cjs` file under `files/` and finds static, type-only and side-effect imports, re-exports, `import()` and `require()`. CSS modules are not read.

Sync only writes or deletes inside the docs copies of owned directories. It checks every path before it changes anything, refuses a path that resolves outside the docs app, and stops on a symlink anywhere between the docs app's root and a target rather than follow it.

The helpers' unit tests for `lib/nav.ts` live in `src/nav.test.ts`, not beside the file, since no test ships with the recipe. Both commands' logic is tested in `src/recipes.test.ts` against temporary directories.

## Layout

```
recipes/
  app-shell/
    recipe.json   the manifest
    files/        the recipe, laid out as it lands in a project
      components/{shell,sidebar,header,main,breadcrumbs}/
      lib/nav.ts
```

### `files/`

Every file under `files/` is part of the recipe, and nothing else is. Paths are relative to the project root, so `files/components/sidebar/sidebar.tsx` lands at `components/sidebar/sidebar.tsx`. Files are copied verbatim: anything a project changes lives in a file the recipe reads, such as the project's own `nav.ts` at its root (imported as `@/nav`), or is passed in as a prop or children.

The files import each other through the `@/` alias, which a Next.js app defines and this package does not. They sit outside `src/` so `pnpm typecheck`, which globs `packages/*/src`, does not compile them here. The one exception is `lib/nav.ts`, which imports nothing and is compiled through its tests in `src/nav.test.ts`. The recipe is typechecked through the docs copy. Lint and format cover both copies.

## The manifest

`recipe.json` describes a recipe. It does not list files: everything under `files/` is the recipe.

| Field          | Meaning                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `name`         | The recipe's id, matching its directory name                                                             |
| `description`  | One line saying what the recipe gives a project                                                          |
| `dependencies` | The npm packages the files import, with version ranges, beyond the `react` and `next` an app already has |

```json
{
  "name": "app-shell",
  "description": "A Next.js app shell with a sidebar, a header with breadcrumbs, and a main area, all driven by one nav config.",
  "dependencies": {
    "@uiid/design-system": "workspace:*",
    "@uiid/icons": "workspace:*",
    "jotai": "^3.0.2"
  }
}
```

The ranges are the ones the docs app uses. `workspace:*` is the range for use inside this repo only: it resolves to the local workspace package, and nothing rewrites it, because `recipe.json` is not a `package.json`. Copied as is into a project outside this repo, it would not install. The `@uiid/*` range for a project outside this repo is not chosen yet.
