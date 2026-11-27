# @uiid/recipes

Recipe source for UIID. A recipe is a set of app files built from UIID components, such as an app shell with a sidebar, a header and a main area. A project gets a recipe by copying its files, not by importing them: nothing imports from `@uiid/recipes`, and it exports no component.

The package is private and is not published or versioned with the `@uiid/*` component packages.

## Edit recipe source here

This package is where recipe source is edited. The docs app runs a copy of the app shell in `apps/docs/components/{shell,sidebar,header,main,breadcrumbs}/` and `apps/docs/lib/nav.ts`, and that copy must stay byte for byte identical to `app-shell/files/`. Make a change here, then make the same change to the docs copy. Never edit the docs copy on its own.

For now the two copies are kept identical by hand. Confirm it with `git diff --no-index --stat` from the repo root, once for each of the five component directories (`git diff --no-index --stat apps/docs/components/sidebar packages/recipes/app-shell/files/components/sidebar`, and so on) and once file to file for `lib/nav.ts` (`git diff --no-index --stat apps/docs/lib/nav.ts packages/recipes/app-shell/files/lib/nav.ts`). No output means they match. Do not diff the two `lib/` directories: `apps/docs/lib/` also holds the docs app's `nav.test.ts`, which is not part of the recipe.

## Layout

```
recipes/
  app-shell/
    recipe.json   the manifest
    files/        the recipe, laid out as it lands in a project
      components/{shell,sidebar,header,main,breadcrumbs}/
      lib/nav.ts
    templates/    a new project's starter files, written once and then the project's own
      nav.ts
      app/{layout.tsx,globals.css,page.tsx}
      app/guides/{page.tsx,getting-started/page.tsx,next-steps/page.tsx}
```

### `files/`

Every file under `files/` is part of the recipe, and nothing else is. Paths are relative to the project root, so `files/components/sidebar/sidebar.tsx` lands at `components/sidebar/sidebar.tsx`. Files are copied verbatim: anything a project changes lives in a file the recipe reads, such as the project's own `nav.ts` at its root (imported as `@/nav`), or is passed in as a prop or children.

The files import each other through the `@/` alias, which a Next.js app defines and this package does not. They sit outside `src/` so `pnpm typecheck`, which globs `packages/*/src`, never compiles them here. The recipe is typechecked through the docs copy. Lint and format cover both copies.

### `templates/`

What a new project gets once and then owns: a starter `nav.ts`, an `app/layout.tsx` that wires the shell, an `app/globals.css` that imports only `@uiid/design-system/globals.css`, and a page for every href in the starter `nav.ts`. The starter is a home page and one group, Guides, with a page of its own and two pages in it, so the sidebar, a group and a three-crumb trail all show on first run. Unlike `files/`, templates are not kept in step with anything: the docs app does not use them, and a project edits its copies freely. `recipe.json` lists each template with its destination, relative to the project root; the starter assumes an app with no `src/` directory.

The templates import the recipe through the `@/` alias, as `files/` does, so nothing in this repo typechecks them. Keep them plain, and read each UIID component's `.types.ts` before using it in a starter page.

The starter layout loads Geist through `next/font/google`, as a new Next.js app does. Next downloads the font files when the app builds, so a build that cannot reach Google Fonts fails; visitors' browsers never contact Google.

## The manifest

`recipe.json` describes a recipe. It does not list the recipe's files, because everything under `files/` is the recipe. It does list the templates, each with its destination.

| Field          | Meaning                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `name`         | The recipe's id, matching its directory name                                                             |
| `description`  | One line saying what the recipe gives a project                                                          |
| `dependencies` | The npm packages the files import, with version ranges, beyond the `react` and `next` an app already has |
| `templates`    | Each path under `templates/`, mapped to its destination relative to the project root                     |

```json
{
  "name": "app-shell",
  "description": "A Next.js app shell with a sidebar, a header with breadcrumbs, and a main area, all driven by one nav config.",
  "dependencies": {
    "@uiid/design-system": "workspace:*",
    "@uiid/icons": "workspace:*",
    "jotai": "^3.0.2"
  },
  "templates": {
    "nav.ts": "nav.ts",
    "app/layout.tsx": "app/layout.tsx",
    "app/globals.css": "app/globals.css",
    "app/page.tsx": "app/page.tsx",
    "app/guides/page.tsx": "app/guides/page.tsx",
    "app/guides/getting-started/page.tsx": "app/guides/getting-started/page.tsx",
    "app/guides/next-steps/page.tsx": "app/guides/next-steps/page.tsx"
  }
}
```

The ranges are the ones the docs app uses. `workspace:*` is the range for use inside this repo only: it resolves to the local workspace package, and nothing rewrites it, because `recipe.json` is not a `package.json`. Copied as is into a project outside this repo, it would not install. The `@uiid/*` range for a project outside this repo is not chosen yet.
