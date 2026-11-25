# Implementation Plan: Menu hardening

Source specs: `spec/capability-map.md` and the `spec/SPEC-<module>.md` files it indexes.

Tasks are tracked in Linear project P-UI-17, "Menu hardening", with one milestone per row of the milestone table below. The tables here are an ordered index of its tickets; acceptance criteria live on the tickets.

## Overview

Four milestones. Harden puts Menu on the `Card` and `ListItem` surface the Select popup wears, styles every row state from tokens, makes submenus work at any depth, gives every element a slot, and puts keyboard behavior under test. Rows adds `description`, `href` and a separator entry to `items`, plus link, separator, group and group-label parts. Choice adds checkbox and radio item parts. Context menu adds a `ContextMenu` that takes the same `items`.

One task is one pull request. Each PR carries its own stories and tests.

## Architecture decisions

- **Menu rebuilds the Select surface; it does not import it.** The helpers live inside `@uiid/forms`, which `@uiid/navigation` must not depend on. Menu composes `Card`, `ListItem` and the global `composes-popup` and `composes-option` classes. A browser test compares Menu's and Select's computed styles so the two cannot drift. Owner decision, 2026-11-25.
- **The surface goes first and is gated.** UI-509 and UI-510 change how every row is built. The owner accepts the look in UI-511 before any other ticket starts, so nothing is built on a look that then changes.
- **One recursive render function, in its own file.** UI-512 introduces it. The rows tickets add branches to it (`href`, separator) and `ContextMenu` imports it. It is not exported from the package.
- **`items` holds plain data; state and structure are parts.** `description`, `href`, `{ type: "separator" }` and nested `items` go in the array. Groups, checkbox items and radio items are parts only. In `List` an entry with `items` is a group, in Menu a submenu, so groups stay out of the array. Select draws the same line.
- **The backdrop follows `modal`.** A non-modal menu draws none. This is a breaking change in UI-513. `ContextMenu` defaults `backdrop` to `true`, matching Select and Menu.
- **`ContextMenu` adds three parts only.** Base UI's ContextMenu re-exports Menu's popup, item, group and submenu parts, so UIID wraps its root, trigger and positioner and reuses the `Menu*` parts for the rest.
- **Browser tests prove anything that depends on paint or layout.** UI-510 adds `menu.browser.test.tsx`, the first in `@uiid/navigation`. Later tickets extend it.

## Milestones

| #   | Milestone    | Modules                     | Done when                                                                                   |
| --- | ------------ | --------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Harden       | `menu-surface`, `menu-core` | Every success criterion in those two specs is checked and the story has lost its `beta` tag |
| 2   | Rows         | `menu-rows`                 | A Table row menu story shows a description, a separator and a link with no change to Table  |
| 3   | Choice       | `menu-choice`               | Checkbox and radio rows line up in one menu in the browser test                             |
| 4   | Context menu | `context-menu`              | `ContextMenu` renders the same rows as `Menu` for the same `items`                          |

## Task list

Sizes: S is one or two files, M is three to five.

### Milestone 1: Harden

| Task   | Title                                                | Spec                   | Size | Blocked by             |
| ------ | ---------------------------------------------------- | ---------------------- | ---- | ---------------------- |
| UI-509 | Render the Menu popup and rows on Card and ListItem  | menu-surface 1, 2, 6–8 | M    | —                      |
| UI-510 | Style every Menu row state from tokens               | menu-surface 3–5       | M    | UI-509                 |
| UI-511 | Accept the new Menu look in Storybook (owner)        | menu-surface           | S    | UI-510                 |
| UI-512 | Render Menu submenus at any depth                    | menu-core 1, 2, 4, 5   | S    | UI-511                 |
| UI-513 | Draw Menu's backdrop only when the menu is modal     | menu-core 7            | S    | UI-511                 |
| UI-516 | Add Menu slots for the portal and submenu popups     | menu-core 3            | S    | UI-512                 |
| UI-517 | Test Menu's keyboard behavior and submenu placement  | menu-core 6            | S    | UI-512                 |
| UI-522 | Rewrite Menu's README and stories, drop the beta tag | menu-core 8            | S    | UI-513, UI-516, UI-517 |

Start: UI-509 alone. Nothing runs in parallel until the checkpoint.

**Checkpoint at UI-511:** the owner looks at the stories and accepts or corrects the look, and settles whether the popup is at least as wide as its trigger. After it, UI-512, UI-513, UI-514 and UI-515 can start in parallel.

**Checkpoint at the end of milestone 1:** unit tests, browser tests, typecheck, lint and `pnpm size` pass on `main`; every success criterion in the two specs is checked.

### Milestone 2: Rows

| Task   | Title                                                            | Spec                 | Size | Blocked by |
| ------ | ---------------------------------------------------------------- | -------------------- | ---- | ---------- |
| UI-514 | Add MenuGroup and MenuGroupLabel parts                           | menu-rows 5          | S    | UI-511     |
| UI-518 | Add description and href to Menu items, with a MenuLinkItem part | menu-rows 1, 2, 6, 7 | M    | UI-512     |
| UI-520 | Add a separator entry to Menu items, with a MenuSeparator part   | menu-rows 3, 4, 7, 8 | S    | UI-518     |

**Checkpoint at the end of milestone 2:** every `items` array in the repo compiles unchanged; the Table story renders with no change to `@uiid/tables`.

### Milestone 3: Choice

| Task   | Title                                      | Spec            | Size | Blocked by |
| ------ | ------------------------------------------ | --------------- | ---- | ---------- |
| UI-515 | Add MenuCheckboxItem and its indicator     | menu-choice 1–6 | M    | UI-511     |
| UI-519 | Add MenuRadioGroup and MenuRadioItem parts | menu-choice 1–6 | S    | UI-515     |

### Milestone 4: Context menu

| Task   | Title                                                  | Spec                    | Size | Blocked by     |
| ------ | ------------------------------------------------------ | ----------------------- | ---- | -------------- |
| UI-523 | Add the ContextMenu root, trigger and positioner parts | context-menu 3, 6, 7    | M    | UI-516, UI-520 |
| UI-524 | Add the ContextMenu component that takes Menu's items  | context-menu 1, 2, 4, 5 | M    | UI-523, UI-513 |

## Risks and mitigations

| Risk                                                                                              | Impact | Mitigation                                                                                                  |
| ------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| Menu's rebuilt surface drifts from Select's over time                                             | Med    | The browser test in UI-510 compares computed styles of the two and fails when they differ                   |
| `Card` or `ListItem` does not fit a menu row without changes                                      | Med    | UI-509 goes first and finds out. Changing either component is "ask first" in the capability map             |
| UI-509 edits `package.json` and the lockfile, outside the build run's push allowlist              | Low    | The ticket says so. The owner pushes that PR, or allows it for the run                                      |
| `MenuItemType` becoming a union in UI-520 breaks `@uiid/tables`, which re-uses the type           | Med    | UI-518 and UI-520 both require every existing `items` array to compile unchanged and run the tables tests   |
| Adding `@uiid/lists` and new parts pushes `@uiid/navigation` over its size limit                  | Low    | Every ticket runs `pnpm size`. Raising a limit is "ask first"                                               |
| Several tickets edit `menu.types.ts`, `menu.test.tsx` and the README at once after the checkpoint | Low    | The render function has its own file from UI-512. Build dependent tickets as a `gh stack`, not side by side |

## Open questions

- Popup width: should Menu's popup be at least as wide as its trigger, as Select's is? Recommendation is no. Settled by the owner in UI-511.
