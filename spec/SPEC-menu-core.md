# Spec: menu-core — V1

Milestone 1. Inherits the shared conventions in `spec/capability-map.md`. Starts after the owner approves the `menu-surface` look.

## Objective

The `items` array behaves correctly at any depth, every element Menu renders can be reached by a slot prop, and the behavior users rely on (keyboard, focus, placement) is under test. Then the beta tag comes off.

## Current behavior this spec changes

- `renderItem` renders a submenu's entries as plain items. An entry there with its own `items` loses its children.
- A submenu's positioner and popup take no props from `Menu`.
- `MenuPortal` takes no props from `Menu`.
- No test covers arrow keys, typeahead, Escape or focus return.
- The story is tagged `beta` and its default render uses raw `<button>` triggers.

## Requirements

1. An entry with `items` opens a submenu at any depth. Rendering is one recursive function shared by the root popup and every submenu.
2. `ItemProps`, `SubmenuRootProps` and `SubmenuTriggerProps` reach every level, as they reach the first level today.
3. New slots `SubmenuPositionerProps` and `SubmenuPopupProps` reach every submenu's positioner and popup. `PortalProps` reaches the root portal. Each slot type omits the keys Menu owns, with a `@ts-expect-error` test per key.
4. An entry's `disabled` wins over the slot's, and its `onClick` runs after `ItemProps.onClick`, at every depth. This is today's rule, kept.
5. Duplicate `value`s among siblings are the caller's error; Menu keys by `value` and documents that it must be unique per level.
6. Keyboard behavior is asserted in tests: Enter, Space and ArrowDown open from the trigger; arrows move the highlight and skip nothing that is enabled; ArrowRight opens a submenu and ArrowLeft closes it; typing a letter moves to the matching row; Escape closes and returns focus to the trigger; choosing an item closes the menu.
7. `backdrop` follows `RootProps.modal`: with `modal: false` no backdrop is drawn, since nothing is blocked. Today it draws regardless, so this is a breaking change, marked in the PR (decided 2026-11-25).
8. The README covers both APIs, every slot, the trigger rules already written, and a short "items or parts" guide. Stories render only from `menu.examples.tsx`, use `Button` triggers, and the `beta` tag is removed.

## Testing strategy

- Unit tests cover 1 to 7.
- `menu.browser.test.tsx` adds: a three-level submenu opens beside its parent without overlap; at a 320px viewport a submenu flips rather than overflowing.
- Stories: nested submenus (three levels), controlled open state, non-modal, placement.

## Success criteria

- [ ] A three-level `items` array renders three popups and each leaf's `onClick` fires.
- [ ] Every element in Menu's tree with a `data-slot` has a slot prop that reaches it, shown by one test per slot.
- [ ] The keyboard tests in requirement 6 pass.
- [ ] `git grep -n '"beta"' apps/storybook/stories/navigation/menu.stories.tsx` returns nothing.
- [ ] `packages/navigation/src/index.test.ts` lists the new slot prop types.

## Out of scope (deferred)

- Top-level `open`, `onOpenChange` and `modal` shortcuts on `Menu`. They stay in `RootProps`.
- Base UI's detached trigger handle (`Menu.createHandle`).

## Open questions

None.
