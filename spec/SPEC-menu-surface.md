# Spec: menu-surface — V1

Milestone 1. Inherits the shared conventions in `spec/capability-map.md`.

## Objective

Menu's popup and rows look like every other popup list in the library, and every row state is visible. Today the surface is hand-written CSS with hardcoded values, and a disabled item looks the same as an enabled one.

## Current behavior this spec changes

- `.popup` paints its own background, border and radius. `.item` sets its own padding, font size and line height in `rem`.
- The highlighted row is inverted (foreground fill, surface text). Select highlights through `composes-option`.
- `[data-disabled]` has no style.
- `ItemLabel` builds the icon and label by hand with a `Group`.

## Requirements

1. `MenuPopup` renders a UIID `Card` with the same surface, padding, radius and shadow as `SelectPopup`. A menu and a select open side by side are visually the same kind of object.
2. `MenuItem` and `SubmenuTrigger` render their content through `ListItem`, taking `label`, `description` and `icon` the way `SelectItem` does. `children` still replaces the row's content.
3. Highlighted, open-submenu and disabled rows each have a distinct look, matching Select's rows for highlighted and disabled. A disabled row is visibly muted and shows no highlight.
4. A submenu trigger keeps its chevron at the far edge, drawn by the part itself, so a composed `SubmenuTrigger` needs no hand-placed icon.
5. No hardcoded `rem`, `px` or color values remain in `menu.module.css`. Values come from the shared popup classes, list tokens, or `menu.tokens.json`.
6. `MenuPopupProps` takes the layout props the Card accepts (`p`, `gap`, `w`, `color`), as `SelectPopupProps` does.
7. `@uiid/navigation` adds `@uiid/lists` as a dependency. It does not depend on `@uiid/forms`. Menu rebuilds the surface from `Card`, `ListItem` and the global `composes-popup` / `composes-option` classes; the forms helpers (`popupLayerCard`, `popupLayerGroupLabel`) stay where they are, and the browser test holds the two in step (decided 2026-11-25).
8. `TableCellDropdown` needs no code change and its menu looks correct in the Table stories.

## Testing strategy

- Unit tests cover 2, 4 and 6, and keep every existing className-merge and slot-precedence test passing.
- `menu.browser.test.tsx` covers 1 and 3 by comparing computed styles of a Menu popup and row against a Select popup and row, and by checking a disabled row's color differs from an enabled one.
- Stories: default, icons, descriptions, disabled, long labels, beside a Select for comparison.

## Success criteria

- [ ] `grep -E "[0-9.]+rem|[0-9]+px" packages/navigation/src/menu/menu.module.css` returns nothing.
- [ ] In the browser test, a Menu popup and a Select popup report the same background, border, radius and padding.
- [ ] A disabled item's computed color differs from an enabled item's, and hovering it adds no highlight.
- [ ] `pnpm size` passes without a raised limit, or the owner has approved the new one.
- [ ] The owner has looked at the Storybook stories and approved the look. This is the project's checkpoint.

## Out of scope (deferred)

- New row kinds. See `menu-rows`.
- A `size` or `color` variant on Menu.

## Open questions

1. Should Menu's popup be at least as wide as its trigger, as Select's is (`min-width: var(--anchor-width)`)? Recommendation: no. An overflow menu on an icon button should size to its content.
