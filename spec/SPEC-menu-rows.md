# Spec: menu-rows — V1

Milestone 2. Inherits the shared conventions in `spec/capability-map.md`.

## Objective

Menu can express the structure real menus have: a second line of text, a divider between sets of actions, a row that navigates, and labeled groups. Plain data goes in `items`; structure is composed from parts.

## Current behavior this spec changes

- `MenuItemType` has `label`, `value`, `icon`, `disabled`, `onClick` and `items` only.
- Base UI's `Separator`, `LinkItem`, `Group` and `GroupLabel` are not wrapped.

## Requirements

1. `MenuItemType` gains `description`, passed to the row's `ListItem`.
2. `MenuItemType` gains `href`. An entry with `href` renders through the new `MenuLinkItem` part (Base UI's `LinkItem`) and is a real link: middle-click and open-in-new-tab work. Its `onClick` still runs. `href` on an entry with `items` is a type error.
3. `items` accepts a separator entry, `{ type: "separator" }`, with no `value` and keyed by index, rendered through the new `MenuSeparator` part. It is the only entry kind with a `type`; ordinary entries need none, so existing arrays keep compiling.
4. `MenuSeparator` is painted like `SelectSeparator` and carries the role Base UI gives a menu separator.
5. `MenuGroup` and `MenuGroupLabel` are exported parts wrapping Base UI's, with the group label painted like `SelectGroupLabel`. They are not expressible in `items`.
6. `MenuLinkItem` takes a `render` so a router's link component can be used, the same way Base UI's does.
7. New slots on `Menu`: `LinkItemProps` and `SeparatorProps`, with owned keys omitted.
8. `@uiid/tables` needs no change: `MenuItemType[]` passed through `TableCellDropdown` gains the new fields for free. A Table story shows a row menu with a separator and a link.

## Testing strategy

- Unit tests cover 1 to 7, including `role="separator"`, the link's `href`, a type-level test that `{ href, items }` is rejected, and arrow keys skipping a separator.
- Browser test: a separator's line matches Select's.
- Stories: descriptions, separators, links, groups (composed).

## Success criteria

- [ ] `items={[{ label, value, description }]}` renders the description under the label.
- [ ] An `href` entry renders an `<a>` with `role="menuitem"` and that `href`.
- [ ] A separator entry renders an element with `role="separator"` that arrow keys skip.
- [ ] `MenuGroup`, `MenuGroupLabel`, `MenuSeparator`, `MenuLinkItem` and their prop types are in `index.test.ts`.
- [ ] Every `items` array in the repo compiles unchanged.

## Out of scope (deferred)

- Groups in `items`, shortcut hints, row colors. See the capability map.

## Open questions

None.
