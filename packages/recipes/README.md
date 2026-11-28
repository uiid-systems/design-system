# @uiid/recipes

Recipe source for UIID. A recipe is a set of app files built from UIID components, such as an app shell with a sidebar, a header and a main area. A project gets a recipe by copying its files, not by importing them: nothing imports from `@uiid/recipes`, and it exports no component.

The package is private and is not published or versioned with the `@uiid/*` component packages.

## Edit recipe source here

This package is where recipe source is edited. The docs app runs a copy of the app shell in `apps/docs/components/{shell,sidebar,header,main,breadcrumbs}/` and `apps/docs/lib/`, and that copy must stay byte for byte identical to `app-shell/files/`. Make a change here, then run `pnpm recipes:sync`. Never edit the docs copy on its own.

## Sync and check

Two commands, run from the repo root, keep the docs copy identical. Both are dependency-free Node scripts in `src/`: Node runs the TypeScript directly by stripping its types, so there is no build step.

- `pnpm recipes:sync` copies `app-shell/files/` over the same paths in `apps/docs/`: it deletes each extra file, then writes each file that differs or is missing. It runs one way only, from this package to the docs app.
- `pnpm recipes:check` exits non-zero and prints one line per problem: each docs file that is `changed`, `missing` or `extra`, each docs directory the recipe does not have, and each `import` in a recipe file that is not on the allowed list. Run `pnpm recipes:sync` to fix changed, missing and extra files. A directory the recipe does not have is deleted or moved by hand, and a disallowed import is fixed in the recipe.

Both commands fail when `files/` is missing or holds no files, so a misplaced recipe cannot pass the check.

A file or directory whose name starts with `.`, such as `.DS_Store`, is never part of the recipe or of the docs copy: it is not copied, reported or deleted. Any other file counts, tracked by git or not, so sync deletes an untracked extra file in an owned directory for good.

What counts as the recipe's comes from what exists under `files/`, so a file or directory added to the recipe is covered without editing the scripts. The rule: the recipe owns each topmost directory under `files/` that directly holds a file. Today that is `components/shell`, `components/sidebar`, `components/header`, `components/main`, `components/breadcrumbs` and `lib`. A directory the recipe only passes through, such as `components/` or the app root, is not owned, so `apps/docs/nav.ts`, `apps/docs/nav.test.ts` and `apps/docs/components/docs/` are not reported or touched while the recipe holds no file directly in `files/components/` or at the root of `files/`. A file directly under `files/` would be compared and copied on its own, to the same path at the app root, without owning the root.

Inside the docs copy of an owned directory, deletion stops at the directories the recipe has:

- A file the recipe does not have, in a directory the recipe has, is extra. Sync deletes it.
- A directory the recipe does not have is reported as a directory, with none of its files listed. Sync refuses to run while one exists, changes nothing, and names it, so a person deletes or moves it.

A stray file in a directory the recipe passes through changes what it owns. If one lands directly in `files/components/`, the recipe owns all of `components/`: `apps/docs/components/docs/` becomes a directory the recipe does not have, so the check fails naming it and sync refuses while it exists. Files sitting directly in `apps/docs/components/` would then count as extra, and sync would delete them once nothing made it refuse. A directory that holds no file owns nothing, so removing a whole directory from the recipe leaves its docs copy in place to delete by hand.

The allowed imports are the list in `.claude/rules/recipes.md`. A recipe file may import `react`, `jotai` and `@uiid/design-system`, bare or through their own subpaths (`react/jsx-runtime`, `jotai/vanilla/utils`, `@uiid/design-system/utils`); `next` and `@uiid/icons` through a subpath only (`next/link`, `@uiid/icons/panel-left`); `@/nav` and `@/lib/nav`; `@/components/<dir>` and its subpaths when `components/<dir>` is a recipe directory; and a relative path that stays inside the file's own recipe directory. A non-relative specifier with a `.` or `..` segment is refused. The check reads every `.ts`, `.tsx`, `.mts`, `.cts`, `.js`, `.jsx`, `.mjs` and `.cjs` file under `files/` and finds static, type-only and side-effect imports, re-exports, `import()` and `require()`. It reads string-literal arguments only: an `import()` or `require()` whose argument is anything but one string literal, such as a variable, a concatenation or a template literal with `${`, fails the check. It does not read CSS.

Sync writes and deletes only recipe paths in the docs app: files inside the docs copies of owned directories, plus the root path of any file directly under `files/`. It checks every path before it changes anything, refuses a path that resolves outside the docs app, and stops on a symlink anywhere between the docs app's root and a target rather than follow it. Paths in the output are printed as JSON strings, so a control character in a file name cannot fake a line.

The helpers' unit tests for `lib/nav.ts` live in `src/nav.test.ts`, not beside the file, since no test ships with the recipe. Both commands' logic is tested in `src/recipes.test.ts` against temporary directories.

## Add a recipe to an app

`uiid-recipes add <recipe>` copies a recipe into a Next.js app that already exists, the same way every time. It is the package's `bin`, `src/cli.mjs`, which only hands the command line to `runCli` in `src/add.ts`. Node runs that TypeScript by stripping its types, so there is no build, but it needs Node 22.18 or later (or 23.6 or later), where type stripping is on by default. Node does not strip types under `node_modules`, so until the package is published from its own repo, run it from a checkout of this repo:

```sh
node packages/recipes/src/cli.mjs add app-shell --cwd ../my-app
```

| Flag          | Meaning                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `--cwd <dir>` | The app's root directory, relative to the current directory. Defaults to the current directory         |
| `--dry-run`   | Runs every check, then prints each file it would write and the install command it would run, and stops |
| `-h, --help`  | Prints usage and exits 0                                                                               |

There are no prompts. Every failure exits 1 with one sentence on stderr saying what failed and what to do.

### What it does

1. Checks everything listed below. Any refusal happens before the first write, so a refused app is left byte for byte as it was.
2. Copies every file under `files/` to the same path in the app, verbatim. Names starting with `.` are skipped, as in sync. Each file is created exclusively, so a file that appeared after the checks stops the copy instead of being replaced.
3. Writes the starter `templates/nav.ts` to `nav.ts` when the app has no `nav.ts`, and keeps the app's own when it has one. It writes no other template.
4. Installs the manifest's `dependencies` with the app's package manager, last: `pnpm add`, `npm install`, `yarn add` or `bun add`, with one `name@range` argument per dependency, run with an argument list and no shell, in the app's root.
5. Prints the wiring to add to `app/layout.tsx` and `app/globals.css` by hand. It never edits `app/layout.tsx`, `app/globals.css` or any page. The wiring is a constant in `src/add.ts`, and tests fail when its imports, its elements or its stylesheet differ from `templates/app/layout.tsx` and `templates/app/globals.css`.

When the install fails, the recipe's files and `nav.ts` stay in place, nothing else in the app has changed, and `add` exits 1 naming the exact command to run by hand in the app. The package manager may have left its own partial changes to `package.json`, the lockfile or `node_modules`. Running `add` again is refused, because the files exist. When a write fails partway, the files printed as `wrote` are in place and the rest are not; no install runs.

Afterwards everything `add` wrote is the app's own. There is no update, repair or remove command, and `recipes:check` covers only the docs app.

### What it refuses

The app must look like a new Next.js App Router app with TypeScript and the `@/*` alias. Apps with a `src/` directory, the Pages Router or another alias are refused, not supported.

| Condition                                                                                        | Says                                                                                                      |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| No `package.json` at the root                                                                    | Run add from the root of a Next.js app, or pass `--cwd <dir>`                                             |
| `package.json` is not JSON                                                                       | Fix it                                                                                                    |
| `next` is in neither `dependencies` nor `devDependencies`                                        | Add the recipe to a Next.js app                                                                           |
| No `app/` directory, with `src/app/` instead                                                     | `src/app` is not supported                                                                                |
| No `app/` directory, with `pages/` instead                                                       | The Pages Router is not supported                                                                         |
| No `app/` directory                                                                              | Add the recipe to an App Router app                                                                       |
| No `tsconfig.json`                                                                               | Add the recipe to a TypeScript app                                                                        |
| `tsconfig.json` cannot be read as JSON with comments and trailing commas                         | Fix it                                                                                                    |
| No `compilerOptions.paths["@/*"]` whose first entry is `"./*"`, in `tsconfig.json` itself        | Add `"paths": { "@/*": ["./*"] }`. `extends` is not followed, so an alias set only in a base config fails |
| Any recipe destination exists, or a directory on its way is a file                               | Lists every one; move or delete them                                                                      |
| A symlink at any existing directory on the way to a destination, or at a destination itself      | Names it                                                                                                  |
| A dependency range starts with `workspace:` and the app is not a member of this repo's workspace | Names the dependencies: the manifest has no published range for them yet                                  |
| No lockfile, or lockfiles for more than one package manager                                      | Lists the lockfiles it looks for, or names the managers                                                   |
| An unknown command or option, no command, no recipe, an extra argument, or `--cwd` with no value | Says what to pass                                                                                         |
| An unknown recipe                                                                                | Lists the recipes                                                                                         |
| `--cwd` does not exist or is not a directory                                                     | Pass an existing app directory                                                                            |

The `--cwd` directory is resolved to its real path first, so the app may be reached through a link; below that, nothing is.

The lockfile is looked for at the app's root: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lock` or `bun.lockb` (the two bun files count as one manager). An app that is a member of this repo's workspace, by `pnpm-workspace.yaml`, uses the workspace root's lockfile instead, since a member has none of its own. Only a member gets `workspace:` ranges, passed through as written; no range is ever rewritten.

### What it refuses in a recipe

`add` treats `recipe.json` as data. It refuses, before writing, a recipe whose manifest is not JSON; a template key that is not a regular file inside `templates/`; a destination, from `files/` or a template, that is not a plain relative path (an empty, `.` or `..` segment, a backslash, a drive letter or NUL) or that would write `package.json`, a lockfile, `tsconfig.json`, `next.config.*`, `.npmrc`, any `.env*`, or anything under `.git/` or `node_modules/`; two destinations that are the same, ignoring case; no `nav.ts` template, or one mapped anywhere but `nav.ts`; and a dependency whose name is not a valid npm package name or whose range is empty, starts with `-`, or holds anything but letters, digits and `. ^ ~ * : + = / @ _ -`. A range such as `>=1 <2` is refused; write `^1.0.0`.

## Layout

```
recipes/
  src/            the commands, their shared logic in recipes.ts, and tests
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

Every file under `files/` is part of the recipe, except one whose name, or a directory's on its path, starts with `.`. Nothing else is. Paths are relative to the project root, so `files/components/sidebar/sidebar.tsx` lands at `components/sidebar/sidebar.tsx`. Files are copied verbatim: anything a project changes lives in a file the recipe reads, such as the project's own `nav.ts` at its root (imported as `@/nav`), or is passed in as a prop or children.

The files import each other through the `@/` alias, which a Next.js app defines and this package does not. They sit outside `src/` so `pnpm typecheck`, which globs `packages/*/src`, does not compile them here. The one exception is `lib/nav.ts`, which imports nothing and is compiled through its tests in `src/nav.test.ts`. The recipe is typechecked through the docs copy. Lint and format cover both copies.

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

The ranges are the ones the docs app uses. `workspace:*` is the range for use inside this repo only: it resolves to the local workspace package, and nothing rewrites it, because `recipe.json` is not a `package.json`. Copied as is into a project outside this repo, it would not install, so `add` refuses the app shell for any app outside this repo's workspace until the manifest has a published range. The `@uiid/*` range for a project outside this repo is not chosen yet.
