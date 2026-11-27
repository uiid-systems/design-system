# Implementation Plan: Installable app shell

Source specs: `spec/capability-map-app-shell.md` and the `spec/SPEC-<module>.md` files it indexes.

Tasks are tracked in Linear project P-UI-18, "Installable app shell", with one milestone per row of the milestone table below. The tables here are an ordered index of its tickets; acceptance criteria live on the tickets.

## Overview

Four milestones. Base makes one nav config the only source of page names and empties the five recipe directories of anything that belongs to the docs app. Package gives the recipe a home in a private `packages/recipes`, keeps the docs copy identical with a check, and adds a script that installs the recipe into a Next.js app. Extract moves that package to its own repository and publishes it. Skills adds `uiid:start-project` and `uiid:scaffold-page` on top of the published command.

One task is one pull request. Tasks marked (owner) are decisions or actions for the owner, not build work.

## Architecture decisions

- **`nav.ts` is the only source of page names.** The sidebar and the breadcrumb trail are both built from it. Nothing title-cases a URL segment. A group gets a crumb only when it has an `href`, so no crumb links to a page that does not exist. Owner decision, 2026-11-26.
- **Matching compares paths only.** Query strings and hashes are ignored. Matching on the query would need `useSearchParams` in the sidebar, which costs every project a Suspense boundary.
- **Pure nav logic lives in `lib/nav.ts`.** UI-527 adds it with tests before anything renders from it. It ships with the recipe and imports nothing but types.
- **No Tailwind.** The docs app drops it in UI-532 and a new project is scaffolded without it, so nothing in the shell depends on stylesheet import order.
- **The package owns the source; the docs app runs a checked copy.** From UI-534 on, recipe source is edited in `packages/recipes/app-shell/files/`, and `pnpm recipes:check` fails when the docs copy differs. This rehearses the relationship the recipes repository will have with its consumers.
- **The script copies; it never rewrites.** Anything a project must change is in a file the recipe reads or is passed in. That is also what lets the docs copy stay byte-identical.
- **Two commands.** `create` makes a new app and may replace its starter layout, because the app is known to be untouched. `add` goes into an existing app, never touches its layout, and prints the wiring.
- **A fresh app uses the published `@uiid/*` packages.** `pnpm recipes:verify` tests what a stranger would get. The cost: a recipe change that needs a library change waits for a release.
- **Extraction comes before the skills.** The skills call `npx @uiid/recipes`, so they never need a clone of this repo.

## Milestones

| #   | Milestone | Modules                              | Done when                                                                                   |
| --- | --------- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| 1   | Base      | `shell-nav`, `shell-boundary`        | Adding one item to `apps/docs/nav.ts` puts the page in the sidebar with the right crumb     |
| 2   | Package   | `recipes-package`, `recipes-install` | `pnpm recipes:verify` builds a fresh app from an empty directory and the owner has tried it |
| 3   | Extract   | `recipes-repo`                       | `npx @uiid/recipes create <dir>` works outside any checkout and `packages/recipes` is gone  |
| 4   | Skills    | `shell-start`, `shell-page`          | `/uiid:start-project` ends with a running app showing the pages the user named              |

## Task list

Sizes: S is one or two files, M is three to five. UI-534 copies many files but writes few.

### Milestone 1: Base

| Task   | Title                                                     | Spec                                 | Size | Blocked by     |
| ------ | --------------------------------------------------------- | ------------------------------------ | ---- | -------------- |
| UI-527 | Add the nav config types and helpers                      | shell-nav 2, 5, 7, 8                 | S    | —              |
| UI-528 | Fill the docs sidebar and pager from nav.ts               | shell-nav 1, 3–6, 9, 10              | M    | UI-527         |
| UI-529 | Build the breadcrumb trail from nav.ts                    | shell-nav 7, 8                       | S    | UI-528         |
| UI-530 | Pass the docs links to Header as children                 | shell-boundary 1, 2                  | S    | —              |
| UI-531 | Render the sidebar's no-flash script from a sidebar part  | shell-boundary 3, 6                  | S    | UI-530         |
| UI-532 | Remove Tailwind from the docs app                         | shell-boundary 7, 8                  | S    | UI-531         |
| UI-533 | Bring the recipe rules and comments in line with the base | shell-nav 11; shell-boundary 4, 5, 9 | S    | UI-529, UI-532 |

Start: UI-527 and UI-530 in parallel. They begin two chains that do not share files: UI-527 → UI-528 → UI-529 works in `lib/`, `sidebar/` and `breadcrumbs/`; UI-530 → UI-531 → UI-532 all touch `app/layout.tsx`, so that chain is a stack.

**Checkpoint at the end of milestone 1:** typecheck, lint and the docs build pass on `main`; `git grep` finds no `sitemap` and no Tailwind in `apps/docs`; every success criterion in the two specs is checked.

### Milestone 2: Package

| Task   | Title                                                                      | Spec                          | Size | Blocked by     |
| ------ | -------------------------------------------------------------------------- | ----------------------------- | ---- | -------------- |
| UI-534 | Add the private recipes package with the app shell's source and manifest   | recipes-package 1–4, 10, 12   | M    | UI-533         |
| UI-535 | Add recipes:sync and recipes:check to keep the docs copy identical         | recipes-package 6, 7, 9       | M    | UI-534         |
| UI-536 | Run recipes:check in the build checks and CI                               | recipes-package 8, 11         | S    | UI-535         |
| UI-537 | Add the app shell's starter templates                                      | recipes-package 5; install 4  | S    | UI-534         |
| UI-538 | Add uiid-recipes add, which copies a recipe into an existing app           | recipes-install 1, 2, 5, 6    | M    | UI-535, UI-537 |
| UI-539 | Add uiid-recipes create, which makes a new app on the shell                | recipes-install 3, 5, 6, 10   | M    | UI-538         |
| UI-540 | Release the design system with the shell's library work (owner)            | recipes-install 8             | S    | —              |
| UI-541 | Add recipes:verify, which builds a fresh app end to end                    | recipes-install 7, 8          | M    | UI-539, UI-540 |
| UI-542 | Run recipes:verify in CI when the recipes package changes                  | recipes-install 9             | S    | UI-541         |
| UI-543 | Try the install on an empty directory and confirm the public names (owner) | recipes-install; recipes-repo | S    | UI-541, UI-536 |

After UI-534, UI-535 and UI-537 can run in parallel. UI-540 has no blocker and can happen any time after milestone 1.

**Checkpoint at UI-543:** the owner runs `create` on an empty directory, uses the result, and confirms the repository name, package name, command name and first version. Nothing in milestone 3 starts before it.

### Milestone 3: Extract

| Task   | Title                                                                     | Spec              | Size | Blocked by |
| ------ | ------------------------------------------------------------------------- | ----------------- | ---- | ---------- |
| UI-544 | Create the uiid-systems/recipes repository with its foundation            | recipes-repo 1    | M    | UI-543     |
| UI-545 | Move the recipes package into the recipes repository                      | recipes-repo 2, 4 | M    | UI-544     |
| UI-546 | Add a demo app to the recipes repository as the recipe's development host | recipes-repo 3, 4 | M    | UI-545     |
| UI-547 | Publish @uiid/recipes to npm (owner steps)                                | recipes-repo 5, 6 | S    | UI-546     |
| UI-548 | Make the design system a pinned consumer of @uiid/recipes                 | recipes-repo 7–11 | M    | UI-547     |

Sequential. UI-544 to UI-547 land in `uiid-systems/recipes`; UI-548 lands here.

**Checkpoint at the end of milestone 3:** `npx @uiid/recipes create <dir>` outside any checkout produces an app that builds; `pnpm recipes:check` and `pnpm recipes:verify` pass here against the published package.

### Milestone 4: Skills

| Task   | Title                                                       | Spec                        | Size | Blocked by     |
| ------ | ----------------------------------------------------------- | --------------------------- | ---- | -------------- |
| UI-549 | Add the uiid:start-project skill                            | shell-start 1–8             | M    | UI-547         |
| UI-550 | Add the uiid:scaffold-page skill                            | shell-page 1–7              | S    | UI-547         |
| UI-551 | Release the skills and move the design system's pin to them | shell-start 9; shell-page 8 | S    | UI-549, UI-550 |
| UI-552 | Remove the installable app shell specs and plan             | —                           | S    | UI-548, UI-551 |

UI-549 and UI-550 can run in parallel, and need only the published package, so they can start alongside UI-548. Both land in `uiid-systems/skills`.

## Where the pull requests go

- **Milestones 1 and 2** stack on the specs branch `adamfratino/app-shell-install-specs` (draft PR #753). The stack has to merge to `main` before UI-540 can release it, so the specs land on `main` with milestone 1 and are removed by UI-552 at the end, as the `@uiid/code` specs were.
- **UI-544 to UI-547** are pull requests in `uiid-systems/recipes`.
- **UI-549 and UI-550** are pull requests in `uiid-systems/skills`.
- **UI-548, UI-551 and UI-552** are pull requests here.

## Tickets a build run cannot push on its own

These edit a workflow file, `.claude/uiid.yml`, rule files, `package.json` or the lockfile, or take a public action. Each ticket says so in its agent notes.

| Ticket                 | Why                                                            |
| ---------------------- | -------------------------------------------------------------- |
| UI-532                 | Edits `apps/docs/package.json` and the lockfile                |
| UI-533                 | Edits `.claude/rules/`                                         |
| UI-534                 | Adds `packages/recipes/**`, outside the allowlist until UI-536 |
| UI-536, UI-542, UI-548 | Edit a workflow file and `.claude/uiid.yml`                    |
| UI-544, UI-547         | Create a public repository; publish to npm                     |
| UI-551                 | Edits `claude-review.yml`                                      |

## Risks and mitigations

| Risk                                                                            | Impact | Mitigation                                                                                                      |
| ------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| Removing Tailwind's reset changes how docs pages look                           | Med    | UI-532 requires a before and after pixel comparison and lists every page that differs                           |
| A fresh app on npm lacks library work the shell needs                           | High   | UI-540 releases first and blocks UI-541. The manifest names the first working version                           |
| Two copies of the recipe drift before the check exists                          | Low    | UI-534 changes no docs file and UI-535 follows it directly                                                      |
| `packages/recipes` trips checks written for component packages                  | Med    | UI-534 adds a named exemption to the registration check and keeps source outside `src/`                         |
| `create-next-app` flags or output change between versions                       | Med    | The script pins the major. UI-539 takes flags from that version's docs, and `recipes:verify` runs the real tool |
| A recipe change needs a library change and stalls on a release                  | Med    | Accepted cost of testing against npm. The gap is fixed in its own PR and released                               |
| The first publish fails because the npm trusted publisher is missing            | Med    | UI-547 lists the owner steps before the first release. The design system has hit and solved this before         |
| The docs breadcrumb is shorter (Home, Box) until category pages exist           | Low    | Decided. Each group gains its `href` in the PR that adds its page                                               |
| A long-lived stack on the specs branch conflicts with other work on `apps/docs` | Med    | Merge the stack milestone by milestone. Check the base against `origin/main` before each build run              |
| Templates are typechecked by nothing until `recipes:verify` exists              | Low    | UI-537 is verified by hand in a scratch app and says so. UI-541 closes the gap                                  |

## Open questions

- Should this repo also keep a committed starter app built against workspace packages? Recommendation is no. Settled by the owner in UI-543.
- Which design system release is the first the shell works on? Recorded in UI-540 when it is cut.
