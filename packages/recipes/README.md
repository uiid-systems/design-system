# @uiid/recipes

Recipe source for UIID. A recipe is a set of app files built from UIID components, such as an app shell with a sidebar, a header and a main area. A project gets a recipe by copying its files, not by importing them: nothing imports from `@uiid/recipes`, and it exports no component.

The package is private and is not published or versioned with the `@uiid/*` component packages.

## Edit recipe source here

This package is where recipe source is edited. The docs app runs a copy of the app shell in `apps/docs/components/{shell,sidebar,header,main,breadcrumbs}/` and `apps/docs/lib/nav.ts`, and that copy must stay byte for byte identical to `app-shell/files/`. Make a change here, then make the same change to the docs copy. Never edit the docs copy on its own.

Until the sync and check commands land, the two copies are kept identical by hand. Confirm it with `git diff --no-index` between each docs directory and its counterpart under `app-shell/files/`; no output means they match.

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

The files import each other through the `@/` alias, which a Next.js app defines and this package does not. They sit outside `src/` so `pnpm typecheck`, which globs `packages/*/src`, never compiles them here. The recipe is typechecked through the docs copy. Lint and format cover both copies.

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

The ranges are the ones the docs app uses. The `@uiid/*` ranges are `workspace:*` while the recipe's only consumers live in this repo.
