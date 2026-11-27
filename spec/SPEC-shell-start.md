# Spec: shell-start — V1

Milestone 4. Inherits the shared conventions in `spec/capability-map-app-shell.md`. Starts after `recipes-repo`. The work lands in `uiid-systems/skills`; this spec stays here with the rest of the project.

## Objective

`/uiid:start-project` takes someone from an idea for an app to a running one on the UIID shell, with their own pages in the navigation. The script does the copying; the skill does what needs judgment: asking what the app is, writing the nav config, and creating a page for each entry.

## Current behavior this spec changes

- The `uiid` plugin has skills for Linear projects and review. None creates or changes a project.
- After `uiid-recipes create`, a project has the starter's three example pages and nav.

## Requirements

1. The skill is `plugins/uiid/skills/start-project/SKILL.md` in the skills repo, listed as `uiid:start-project`, and can be invoked by the user by name.
2. It asks for the least it needs, one question at a time: where to create the app, what it is called, and its pages. It proposes a nav from a one-line description of the product and lets the user correct it, and never asks for the nav entry by entry.
3. It runs `npx @uiid/recipes@<version> create <dir>`, with the version written in the skill. It does not copy, retype or edit any file under the recipe's directories.
4. It rewrites `nav.ts` with the agreed pages, creates one `page.tsx` per nav item, removes the starter's example pages, and sets the sidebar title and the page metadata.
5. Every page it writes is built from UIID components. Before using a component it reads that component's types from the installed package. A page is a titled placeholder, not invented product UI.
6. It finishes by running the app's typecheck and production build, and reports the directory tree, the command to start the dev server, and anything that failed with its output.
7. It stops and says so, changing nothing, when the target directory is not empty or when `create` fails.
8. It does not commit, push, create a remote, deploy or add any dependency the recipe did not.
9. The skills repo releases a new version. This repo's `.claude/settings.json` and `claude-review.yml` move to it together, and the `AGENTS.md` skills table gains a row.

## Testing strategy

- A recorded run in the skills PR: the skill invoked in an empty directory with a three-group nav, ending in a passing build. The PR shows the resulting `nav.ts` and tree.
- A recorded refusal: the skill invoked in a non-empty directory changes nothing.
- The skills repo's existing checks.

## Success criteria

- [ ] From an empty directory, one invocation ends with a running app whose sidebar and breadcrumbs show the pages the user named.
- [ ] `diff -r` between the published package's `app-shell/files` and the same paths in the created app is empty.
- [ ] The created app's typecheck and production build pass with no manual edit.
- [ ] No file from the starter's example pages remains.
- [ ] `/uiid:start-project` is listed in this repo's session after the pin moves.

## Out of scope (deferred)

- Adding the shell to an app that exists. `uiid-recipes add` covers the copy; a skill for it waits for demand.
- Auth, data, deployment or any product code.
- Choosing a shell variant. There is one.
- Tools other than Claude Code. They can read the skill file, as `AGENTS.md` describes.

## Open questions

None.
