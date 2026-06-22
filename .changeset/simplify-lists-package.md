---
"@uiid/lists": patch
"@uiid/forms": patch
"@uiid/tokens": patch
---

Simplify the lists package and prune downstream consumers.

- **`@uiid/lists`**: replace `type` (ordered/unordered/none), `direction`, and `size` with a single `marker` prop (`"none" | "disc" | "decimal" | "square"`; `decimal` renders `<ol>`, others `<ul>`). Rename `ListItemGroup` → `ListGroup` and export it alongside `ListItem`. `ListItem` now accepts `children`, which override the label/description block. Drop the `content` and `action` slots, the `selected` and `disabled` props (along with the `ListSelectedIcon` subcomponent), the dead `description` field on `ListGroupProps`, the `HorizontalListProps | VerticalListProps` discriminated union, and all collapsible behavior (Base UI `Collapsible` wiring, `collapsible`/`open`/`defaultOpen`/`onOpenChange` props, the ChevronsUpDown trigger icon). `ListGroup` is now a purely visual grouping with a static header. Add `GroupProps` pass-through on `List` alongside the existing `ItemProps`. Tighten default item padding via tokens. Fixes a latent token-name typo (`--list-group-category-minHeight` → `-min-height`).
- **`@uiid/forms`**: drop `size` from `AutocompleteListProps`, `ComboboxListProps`, and `SelectListProps`; stop forwarding it to `<List>`. Remove `size` from the `Autocomplete` and `Combobox` roots (its only effect was the list scaling). `Select` keeps `size` on the trigger/value via `InputVariants`. Stop forwarding `selected={state.selected}` from `SelectItem`/`ComboboxItem` to `ListItem` (Base UI's `data-selected` attribute is still set via the renderProps spread). Dropdown list items now render at the default token sizing.
- **`@uiid/tokens`**: remove the dead `list.size.{sm,md,lg}` block from `list.tokens.json`.

Adopt the examples-driven storybook pattern: add `list.examples.tsx` (Default, WithIcons, WithDescriptions, NestedGroups, Markers, Composable) and rewrite the story as a thin shim. Drop the orphaned mock files.
