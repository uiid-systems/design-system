# Spec: shell-page — V1

Milestone 4. Inherits the shared conventions in `spec/capability-map-app-shell.md`. Starts after `recipes-repo`, and can be built alongside `shell-start`. The work lands in `uiid-systems/skills`.

## Objective

`/uiid:scaffold-page` adds a page to a project that already has the shell: a route file and its nav entry, in one step, so the two never drift apart.

## Current behavior this spec changes

- Adding a page means creating `app/<path>/page.tsx` and editing `nav.ts` by hand. Forgetting the second leaves a page nothing links to.

## Requirements

1. The skill is `plugins/uiid/skills/scaffold-page/SKILL.md` in the skills repo, listed as `uiid:scaffold-page`, and can be invoked by the user by name.
2. It works only in a project that has `nav.ts`, `lib/nav.ts` and `components/sidebar/`. Anywhere else it says the shell is not installed, names `uiid:start-project`, and changes nothing.
3. It needs three things and takes them from the request when they are given: the page's label, its path, and where it sits in the nav (an existing group, a new group, or the top level). It asks only for what is missing, and proposes the path from the label.
4. It refuses, changing nothing, when the route file exists or when `nav.ts` already has that href.
5. It adds the entry to `nav.ts` at the end of the chosen group or list, keeping the file's formatting, and creates the `page.tsx` as a titled placeholder built from UIID components, reading each component's types from the installed package first.
6. It edits nothing under the recipe's directories and nothing but those two files.
7. It runs the project's typecheck and reports the two paths it wrote.
8. It ships in the same skills release as `shell-start`, or the next one, with a row in this repo's `AGENTS.md` skills table when the pin moves.

## Testing strategy

- Recorded runs in the skills PR, in an app made by `uiid-recipes create`: a page added to an existing group, a page added in a new group, and both refusals.
- The skills repo's existing checks.

## Success criteria

- [ ] After one invocation the new page is in the sidebar, opens with the right breadcrumb, and its group is open on load.
- [ ] `git status` in the project shows exactly one modified file (`nav.ts`) and one new file.
- [ ] Invoking it again with the same path changes nothing.
- [ ] The project's typecheck passes.

## Out of scope (deferred)

- Dynamic routes, route groups, layouts, loading and error files.
- Renaming, moving or removing a page.
- Generating page content beyond a titled placeholder.

## Open questions

None.
