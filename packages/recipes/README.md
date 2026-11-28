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

## The `uiid-recipes` command

`uiid-recipes` has two commands. `add <recipe>` copies a recipe into a Next.js app that already exists. `create <dir>` makes a new Next.js app and puts the app shell in it. Both do the same thing every time, with no prompts, and every failure exits 1 with one sentence on stderr saying what failed and what to do.

The command is the package's `bin`, `src/cli.mjs`, which only hands the command line to `runCli` in `src/cli.ts`; the commands themselves are `src/add.ts` and `src/create.ts`. Node runs that TypeScript by stripping its types, so there is no build, but it needs Node 22.18 or later (or 23.6 or later), where type stripping is on by default. Node does not strip types under `node_modules`, so until the package is published from its own repo, run it from a checkout of this repo:

```sh
node packages/recipes/src/cli.mjs add app-shell --cwd ../my-app
node packages/recipes/src/cli.mjs create ../my-app
```

Today both examples are refused: the app-shell recipe is refused for any app outside this repo's workspace until its manifest has a published range for the `@uiid/*` packages (see [The manifest](#the-manifest)). Inside the workspace, such as an app under `apps/`, both run.

Both commands run a package manager, which runs the project's own install scripts and config, so point `add` only at a project you trust.

| Flag          | Meaning                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `--cwd <dir>` | `add` only: the app's root directory, relative to the current directory. Defaults to the current directory |
| `--dry-run`   | Runs every check, then prints each file it would write and each command it would run, and stops            |
| `-h, --help`  | Prints usage for both commands and exits 0                                                                 |

These refusals belong to the command line, before either command reads anything: no command, an unknown command, an unknown option, `add` with no recipe or `create` with no directory, an extra argument, `--cwd` with no value, and `--cwd` given to `create`. Each says what to pass.

## Add a recipe to an app

`uiid-recipes add <recipe>` copies a recipe into a Next.js app that already exists.

### What it does

1. Checks everything listed below. Any refusal happens before the first write, so a refused app is left byte for byte as it was.
2. Copies every file under `files/` to the same path in the app, verbatim. Names starting with `.` are skipped, as in sync. Each target is checked for symlinks again right before it is written, and each file is created exclusively, so a file that appeared after the checks stops the copy instead of being replaced.
3. Writes the starter `templates/nav.ts` to `nav.ts` when the app has no `nav.ts`, and keeps the app's own when it has one. It writes no other template.
4. Prints the wiring to add to `app/layout.tsx` and `app/globals.css` by hand, before the install, so it is shown even when the install fails. It never edits `app/layout.tsx`, `app/globals.css` or any page. The wiring is a constant in `src/add.ts`, and tests fail when its imports, its elements or its stylesheet differ from `templates/app/layout.tsx` and `templates/app/globals.css`.
5. Installs the manifest's `dependencies` with the app's package manager, last: `pnpm add`, `npm install`, `yarn add` or `bun add`, with one `name@range` argument per dependency, run with an argument list and no shell, in the app's root.

When the install fails, the recipe's files and `nav.ts` stay in place, the wiring has been printed, nothing else in the app has changed, and `add` exits 1 naming the exact command to run by hand in the app. The package manager may have left its own partial changes to `package.json`, the lockfile or `node_modules`. Running `add` again is refused, because the files exist. When a write fails partway, the files printed as `wrote` are in place and the rest are not; no install runs.

Afterwards everything `add` wrote is the app's own; see [What a project owns afterwards](#what-a-project-owns-afterwards).

### What it refuses

The app must look like a new Next.js App Router app with TypeScript and the `@/*` alias. Apps with a `src/` directory, the Pages Router or another alias are refused, not supported.

| Condition                                                                                        | Says                                                                                                      |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `package.json`, `app` or `tsconfig.json` at the root is a symlink                                | Names it; replace it with the real file or directory                                                      |
| No `package.json` at the root                                                                    | Run add from the root of a Next.js app, or pass `--cwd <dir>`                                             |
| `package.json` is not JSON                                                                       | Fix it                                                                                                    |
| `next` is in neither `dependencies` nor `devDependencies`                                        | Add the recipe to a Next.js app                                                                           |
| No `app/` directory, with `src/app/` instead                                                     | `src/app` is not supported                                                                                |
| No `app/` directory, with `pages/` instead                                                       | The Pages Router is not supported                                                                         |
| No `app/` directory                                                                              | Add the recipe to an App Router app                                                                       |
| No `tsconfig.json`                                                                               | Add the recipe to a TypeScript app                                                                        |
| `tsconfig.json` cannot be read as JSON with comments and trailing commas                         | Fix it                                                                                                    |
| No `compilerOptions.paths["@/*"]` whose first entry is `"./*"`, in `tsconfig.json` itself        | Add `"paths": { "@/*": ["./*"] }`. `extends` is not followed, so an alias set only in a base config fails |
| `compilerOptions.baseUrl` is set to anything but the app root                                    | Remove `baseUrl` or set it to `"."`                                                                       |
| A directory on the way to a recipe destination is a file                                         | Names it; move or rename it                                                                               |
| Any recipe destination exists                                                                    | Lists every one; move or delete them                                                                      |
| A symlink at any existing directory on the way to a destination, or at a destination itself      | Names it                                                                                                  |
| A dependency range starts with `workspace:` and the app is not a member of this repo's workspace | Names the dependencies: the manifest has no published range for them yet, so run add in a workspace app   |
| No lockfile, or lockfiles for more than one package manager                                      | Lists the lockfiles it looks for, or names the managers                                                   |
| An unknown command or option, no command, no recipe, an extra argument, or `--cwd` with no value | Says what to pass                                                                                         |
| An unknown recipe                                                                                | Lists the recipes                                                                                         |
| `--cwd` does not exist or is not a directory                                                     | Pass an existing app directory                                                                            |

The `--cwd` directory is resolved to its real path first, so the app may be reached through a link; below that, nothing is.

The lockfile is looked for at the app's root: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lock` or `bun.lockb` (the two bun files count as one manager). An app that is a member of this repo's workspace, by `pnpm-workspace.yaml`, uses the workspace root's lockfile instead, since a member has none of its own. Only a member gets `workspace:` ranges, passed through as written; no range is ever rewritten.

### What it refuses in a recipe

`add` treats `recipe.json` as data. It refuses, before writing, a recipe whose `files/` is empty, missing or holds a non-regular file; a manifest that is not JSON; a template key that is not a regular file inside `templates/`; a destination, from `files/` or a template, that is not a plain relative path (an empty, `.` or `..` segment, a backslash, a drive letter or NUL) or that would write `package.json`, a lockfile, `tsconfig.json`, `next.config.*`, `.npmrc`, any `.env*`, or anything under `.git/` or `node_modules/`, all matched ignoring case; any file directly under `files/`, since a file at the app root could be package-manager config such as `bunfig.toml` or `pnpm-workspace.yaml`, read by the install that follows; two destinations that are the same, ignoring case; no `nav.ts` template, or one mapped anywhere but `nav.ts`; and a dependency whose name is not a valid npm package name or whose range is not one of two shapes.

The two range shapes are a plain semver version or range with no protocol, which is an optional `^` or `~`, one to three numbers joined by dots and an optional prerelease (`1.2.3`, `^3.0.2`, `~1.2`, `^2.0.0-rc.1`), and `workspace:*`, `workspace:^` or `workspace:~`. Everything else is refused, because it could install other code under the dependency's name: dist-tags such as `latest`, URLs, `git+…`, `github:`, `file:`, `link:`, `npm:` aliases, comparator ranges such as `>=1 <2`, `1.x`, `*` and build metadata.

## Create an app

`uiid-recipes create <dir>` makes a new Next.js app in `<dir>` and puts the app shell in it, so one command turns an empty directory into an app that runs on the shell. It always applies the one recipe, `app-shell`, and takes no recipe argument.

`create` cannot complete for a directory outside this repo's workspace until the app-shell manifest has a published range for the `@uiid/*` packages: it is refused before anything runs, as `add` is. A new directory under `apps/` is a workspace member and runs.

### What it does

1. Checks everything that can be checked before anything runs: the directory, its name, the recipe and its manifest, and the dependency ranges, as listed below. A refusal runs nothing and creates nothing.
2. Scaffolds the app with `create-next-app@16`, pinned to the major of `next` the recipe is built on (the docs app's), with no shell: `npx --yes create-next-app@16 <name> --yes --ts --app --no-src-dir --no-tailwind --import-alias @/* --no-linter --no-react-compiler --no-cache-components --agents-md --no-agent-feedback --use-npm`, run in the directory's parent. Every option is given, because `--yes` would otherwise take an option that is not passed from preferences saved on an earlier run. npm is used because it ships with Node. For a member of this repo's workspace, `--skip-install` is added, because the workspace's package manager installs the app in step 5.
3. Treats what the scaffold made as untrusted and checks it again with every check `add` makes on an app (`package.json` lists `next`, `app/` at the root, the `@/*` alias, `baseUrl`, one lockfile), then checks that the app has no `tailwindcss` or `@tailwindcss/*` in `dependencies` or `devDependencies` and no `postcss.config.*`, that no recipe file, `nav.ts` or starter page exists yet, and that `app/layout.tsx`, `app/globals.css` and `app/page.tsx` are regular files.
4. Copies every file under `files/` and writes every template to its destination, as `add` copies, each created exclusively and each target checked for symlinks again right before it is written. Exactly three files are replaced rather than created, and only these, fixed in `src/create.ts`: `app/layout.tsx`, `app/globals.css` and `app/page.tsx`, with the starter layout, stylesheet and home page. Since the layout is the starter's, nothing is printed to wire by hand.
5. Installs the manifest's `dependencies`, as `add` does, with the app's package manager: npm, or the workspace's for a member.
6. Prints the app's directory and the one command that starts it, such as `npm run dev`.

`--dry-run` makes the same checks as step 1, then prints the scaffold command, each file it would write or replace and the install command, and runs and writes nothing; the directory is not created.

### When it fails partway

Once the scaffold has started, `create` never deletes anything. A failure in any later step (the scaffold exits non-zero or cannot start, it exits 0 but makes no app, a check in step 3 fails, a write fails, or the install fails) exits 1 with one sentence that names the directory, says it is left in place, and says what to do: delete it and run `create` again, or, when only the install failed, run the printed install command in it by hand. Whatever was made up to that point stays as it was: the scaffold's files, and the files printed as `wrote` or `replaced`.

### What it refuses before running anything

| Condition                                                                                                                   | Says                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `<dir>`'s parent does not exist, or is not a directory                                                                      | Create the parent first, or name a directory inside one that exists                                                |
| `<dir>` is a symlink, even to an empty directory                                                                            | Name a directory that does not exist yet, or an empty one                                                          |
| `<dir>` exists and is not a directory                                                                                       | Name a directory that does not exist yet, or an empty one                                                          |
| `<dir>` holds any entry, dot-named ones such as `.git` included                                                             | Changed nothing; name a directory that does not exist yet, or an empty one                                         |
| The directory's name is not a package name create-next-app accepts                                                          | Use lower-case letters, digits, `.`, `_` and `-`, starting with a letter or a digit, and not a Node.js module name |
| Anything `add` refuses in a recipe (see [What it refuses in a recipe](#what-it-refuses-in-a-recipe)), but the `nav.ts` rule | Fix the recipe                                                                                                     |
| The manifest maps no template to `app/layout.tsx`, `app/globals.css` or `app/page.tsx`                                      | Fix the recipe's `recipe.json`                                                                                     |
| A dependency range starts with `workspace:` and `<dir>` is not a member of this repo's workspace                            | Names the dependencies: the manifest has no published range for them yet                                           |
| `<dir>` is a workspace member and the workspace root has no lockfile, or more than one                                      | Lists the lockfiles it looks for, or names the managers                                                            |

The parent of `<dir>` is resolved to its real path, so it may be reached through a link; `<dir>` itself may not be one.

### What it fails on after the scaffold

Each of these leaves the directory in place, as above.

| Condition                                                                                            |
| ---------------------------------------------------------------------------------------------------- |
| create-next-app cannot start, or exits with a code other than 0                                      |
| create-next-app exits 0, but `<dir>` is missing, is not a directory, or is empty                     |
| Any check `add` makes on an app, from a symlinked `package.json` to the lockfile                     |
| The app depends on `tailwindcss` or any `@tailwindcss/*` package, or has a `postcss.config.*`        |
| A recipe file, `nav.ts` or a starter page already exists, or a file sits where one needs a directory |
| `app/layout.tsx`, `app/globals.css` or `app/page.tsx` is missing, not a regular file, or a symlink   |
| A write fails, including a file that appeared, or stopped being a regular file, after the checks     |
| The install exits non-zero or cannot start                                                           |

## What a project owns afterwards

Everything `add` or `create` writes is the project's own: the recipe's files, `nav.ts`, the starter pages, the layout and the stylesheet, and for `create` the whole app create-next-app made. The project edits any of them freely. Nothing keeps them in step with this package: there is no update, repair or remove command, running `add` again on a project that has the files is refused, and `recipes:check` covers only the docs app. A project that wants a newer recipe copies the changes by hand.

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
