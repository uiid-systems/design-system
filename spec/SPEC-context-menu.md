# Spec: context-menu — V1

Milestone 4. Inherits the shared conventions in `spec/capability-map.md`.

## Objective

A new `ContextMenu` in `@uiid/navigation` opens the same menu on right-click or long-press over an area. Base UI's ContextMenu re-exports Menu's popup, item, group, checkbox, radio and submenu parts and adds only its own root, trigger and positioner, so this component is thin by design.

## Requirements

1. `ContextMenu` takes `items` (the same `MenuItemType[]`) and `children`, the area that responds to right-click and long-press.
2. It renders rows through the same recursive function as `Menu`, so submenus, separators, links and descriptions behave identically. The function is shared inside the package, not exported.
3. New parts: `ContextMenuRoot`, `ContextMenuTrigger` and `ContextMenuPositioner`, wrapping Base UI's. Every other part is Menu's own (`MenuPopup`, `MenuItem`, and so on); there are no `ContextMenu*` duplicates of them.
4. Slots mirror Menu's where the element exists: `RootProps`, `TriggerProps`, `PositionerProps`, `PopupProps`, `ItemProps`, the submenu slots, `LinkItemProps`, `SeparatorProps`. There is no `side` or `align`: the popup opens at the pointer.
5. `backdrop` defaults to `true`, matching `Select` and `Menu`, and follows `RootProps.modal` the way Menu's does (decided 2026-11-25).
6. The trigger area keeps its own layout: `ContextMenuTrigger` adds no wrapper box that changes the child's size, and takes `render`.
7. Lives in `packages/navigation/src/context-menu/` with the full file set: component, types, examples, test, README.

## Testing strategy

- Unit tests: right-click opens the menu, items fire `onClick`, Escape closes, a three-level `items` array works, slots reach their elements, owned keys are rejected.
- Browser test: the popup opens at the pointer position and stays inside a 320px viewport.
- Stories: over a card, over a table row, with submenus, composed from parts.

## Success criteria

- [ ] `<ContextMenu items={items}><Card /></ContextMenu>` opens on `contextmenu` and renders the same rows as `<Menu items={items} />`.
- [ ] The trigger area's measured box equals the child's box without the wrapper.
- [ ] `ContextMenu`, its three parts and their types are in `index.test.ts`; no other new exports.
- [ ] `pnpm size` passes, with a new entry for the component if the size config lists components individually.

## Out of scope (deferred)

- A Table option that puts a row's actions on right-click.
- Opening the same menu from both a button and a right-click through one shared handle.

## Open questions

None.
