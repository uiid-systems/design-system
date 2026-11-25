# Capability Map: Menu hardening

## Intent

Bring `Menu` in `@uiid/navigation` up to the standard of the library's other popups, then fill in the Base UI parts it does not wrap yet. Menu is the component behind every row action and overflow button, and it has had little attention since it moved packages.

- **User:** anyone putting actions behind a control. The first proving consumer is `TableCellDropdown` in `@uiid/tables`.
- **Look:** Menu wears the same surface as the Select, Combobox and Autocomplete popups: a UIID `Card` holding `ListItem` rows. One popup-list look across the library.
- **Two APIs, one rule:** the `items` array covers plain data (label, icon, description, disabled, onClick, href, separators, nested submenus). Anything that carries its own state or structure (groups, checkbox items, radio items) is an exported part. Select already draws the line in the same place.
- **API:** the 1.0 rules in `.claude/rules/components.md`. Mirror Base UI's names and props, export every composition part, top-level props win over slot props, slot types omit owned keys.

## Modules

| Module id      | Milestone      | Responsibility                                                                                  | Depends on               |
| -------------- | -------------- | ----------------------------------------------------------------------------------------------- | ------------------------ |
| `menu-surface` | 1 Harden       | Popup and rows on the shared `Card` + `ListItem` surface, every row state styled, tokens        | —                        |
| `menu-core`    | 1 Harden       | Recursive submenus, slot props that reach submenus, keyboard and browser tests, stories, README | `menu-surface`           |
| `menu-rows`    | 2 Rows         | `description`, separator and `href` in `items`; separator, link, group and group-label parts    | `menu-surface`           |
| `menu-choice`  | 3 Choice       | Checkbox item, radio group and radio item parts with their indicators                           | `menu-rows`              |
| `context-menu` | 4 Context menu | New `ContextMenu` component that takes the same `items` and reuses Menu's parts                 | `menu-core`, `menu-rows` |

Build order: `menu-surface` → `menu-core`, `menu-rows` → `menu-choice`, `context-menu`

Each module has a spec beside this file: `spec/SPEC-<module id>.md`. Module ids do not change.

One owner look checkpoint gates the rest: after `menu-surface`, the owner judges the new popup and row states in Storybook before `menu-core` and `menu-rows` build on them.

## What the audit found (2026-11-25)

- A disabled item has no visual style. `menu.module.css` has no `[data-disabled]` rule.
- Item and popup spacing, font size and radius are hardcoded `rem` values. The only menu tokens are the backdrop's opacity and z-index.
- The surface and the inverted highlight are Menu's own, and differ from the `Card` + `ListItem` popups in `@uiid/forms`.
- Submenus nest one level. An entry inside a submenu that has its own `items` renders as a plain item and its children are dropped.
- `PositionerProps` and `PopupProps` reach the root popup only. A submenu's positioner and popup cannot be reached from `Menu`.
- `MenuPositioner` sets `sideOffset` and `collisionPadding` as literals before the spread, which is fine, but submenus get the same 4px offset as the root.
- Of Base UI's Menu parts, these are not wrapped: `Group`, `GroupLabel`, `Separator`, `LinkItem`, `CheckboxItem`, `CheckboxItemIndicator`, `RadioGroup`, `RadioItem`, `RadioItemIndicator`, `Arrow`.
- Tests cover slots, classes, triggers and callbacks. None cover arrow-key navigation, typeahead, Escape, focus return, or anything that needs layout. There is no browser test.
- The story is tagged `beta` and its default render uses raw `<button>` elements.

## Shared conventions

Every module spec inherits this section and states only what differs.

### Tech stack

React 19, TypeScript 7, Vite 8, `@base-ui/react` 1.9, CSS Modules with design tokens, Vitest on happy-dom, Vitest browser mode on Playwright Chromium, Storybook.

### Commands

```
Install:        pnpm install
Unit tests:     pnpm test:run packages/navigation
Browser tests:  pnpm test:browser
Typecheck:      pnpm typecheck
Lint:           pnpm run lint
Format check:   pnpm run format:check
Build package:  pnpm run build --filter=@uiid/navigation
Build docs:     pnpm run build --filter=docs
Bundle sizes:   pnpm size
Storybook:      pnpm --filter @uiid/storybook dev
```

### Project structure

```
packages/navigation/src/menu/                  Menu, its parts in subcomponents/
packages/navigation/src/context-menu/          ContextMenu (milestone 4), same layout
packages/navigation/src/index.test.ts          the exact public surface
packages/tokens/src/json/component/menu.tokens.json
packages/forms/src/shared/popup-layer/         the surface Menu is matching
packages/lists/src/list/                       ListItem, the row
packages/tables/src/table/subcomponents/table-cell-dropdown.tsx   the proving consumer
apps/storybook/stories/navigation/menu.stories.tsx
spec/                                          this map and the module specs
```

### Code style

A part wraps one Base UI part, keeps its name, sets `data-slot`, and takes its look from a UIID component through `render`. Defaults are destructured, never written as literals on the `render` element, so a caller's props still win:

```tsx
export const MenuItem = ({
  label,
  description,
  icon,
  className,
  children,
  ...props
}: MenuItemProps) => (
  <BaseMenu.Item
    data-slot="menu-item"
    {...props}
    className={cx(styles["item"], className)}
  >
    <ListItem
      render={<div />}
      w="full"
      label={label}
      description={description}
      icon={icon}
    >
      {children}
    </ListItem>
  </BaseMenu.Item>
);
```

- Layout through `Stack`, `Group` and style props. CSS Modules for visual styling and `data-*` state only. No inline `style`.
- State selectors written as `:where(.local)[data-…]`, because the docs build compiles CSS modules in pure mode.
- Token JSON holds literals and plain references only.

### Testing strategy

- **Unit (happy-dom), `menu.test.tsx`:** rendering, `data-slot`, props, callbacks, roles and names, keyboard behavior, and a `// @ts-expect-error` line for each owned key a slot type omits. Assert role and keyboard results, not console output: Base UI dedupes its dev warnings.
- **Browser (Chromium), `menu.browser.test.tsx`:** anything that depends on layout or paint: disabled and highlighted row styles, submenu placement, collision at a narrow viewport. `packages/forms/src/input/masks/` holds the existing browser tests and is the reference.
- **Stories:** one story per variant dimension, rendered from `menu.examples.tsx`. Every visual rule in a spec has a story that shows it.
- **Surface:** any change to exports changes `packages/navigation/src/index.test.ts` in the same PR.

### Boundaries

- **Always:** read a UIID component's `.types.ts` before using it; keep Base UI's part and prop names; add a story and a test with each behavior; mark breaking changes with `!` in the PR title and name them in the body; run unit tests, browser tests, typecheck, lint and `pnpm size` before opening a PR.
- **Ask first:** changing `ListItem`, `Card` or the forms popup layer to make Menu fit; adding any dependency beyond `@uiid/lists`; changing the `backdrop` default; raising a size limit.
- **Never:** rename a Base UI part or recast a prop it already ships; add a parallel JS lookup map where `cva` or a data attribute does the job; hand-edit generated token CSS; remove or skip a failing test; add AI attribution to commits or PRs.

## Out of scope for the whole project

- Filterable menu (`Menu.Input`, `Menu.FilterProvider`). Base UI 1.9 marks it preview. Revisit when it is stable.
- `Menubar` and `NavigationMenu`. No consumer in the repo.
- Keyboard shortcut hints on a row. `ListItem` has no trailing slot and the library has no `Kbd`.
- A destructive or other color axis on a row.
- Groups in the `items` array. In `List` an entry with `items` is a group; in Menu it is a submenu. Groups stay parts.
- `Menu.Arrow`. No other UIID popup draws one.
