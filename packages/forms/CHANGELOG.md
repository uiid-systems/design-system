# @uiid/forms

## 0.0.32

### Patch Changes

- Updated dependencies [[`44f8663`](https://github.com/uiid-systems/design-system/commit/44f866323350069637adc500e71d8315e6cb2a5f)]:
  - @uiid/buttons@0.0.32
  - @uiid/cards@0.0.32
  - @uiid/icons@0.0.32
  - @uiid/layout@0.0.32
  - @uiid/lists@0.0.32
  - @uiid/overlays@0.0.32
  - @uiid/tokens@0.0.32
  - @uiid/typography@0.0.32
  - @uiid/utils@0.0.32

## 0.0.31

### Patch Changes

- [#250](https://github.com/uiid-systems/design-system/pull/250) [`e3d09bf`](https://github.com/uiid-systems/design-system/commit/e3d09bfdb8dfdc38440c77226738e90f45cdc998) Thanks [@adamfratino](https://github.com/adamfratino)! - Add a shared `.text` composition to `@uiid/tokens/compositions.module.css` holding the root text-rendering fundamentals (`text-wrap`, `text-rendering`, `font-feature-settings`). `Text`, `Prose`, and the form `Textarea` now compose it instead of duplicating those declarations, and `Separator` composes it for its label — removing `@uiid/typography` as a dependency of `@uiid/layout` so the layout primitives no longer rely on the `Text` component. Note: the `Separator` string label no longer renders with `muted`/`bold` emphasis; it uses the default text style.

- [#251](https://github.com/uiid-systems/design-system/pull/251) [`3bf512a`](https://github.com/uiid-systems/design-system/commit/3bf512aa1427d9ba1f52e4929abe8360fb1bdddc) Thanks [@adamfratino](https://github.com/adamfratino)! - Fix `Text` `truncate` and `balance`, which were silently overridden by the `.text` composition's `text-wrap: pretty` in the always-win `uiid.compositions` layer. Both toggles now live in that layer (declared after `.text`) so they actually apply. As a result, `Select` and `SelectMultiple` triggers truncate their value to a single line with an ellipsis instead of wrapping. When truncated with string/number children, `Text` also sets a native `title` attribute exposing the full text on hover.

- Updated dependencies [[`e3d09bf`](https://github.com/uiid-systems/design-system/commit/e3d09bfdb8dfdc38440c77226738e90f45cdc998), [`3bf512a`](https://github.com/uiid-systems/design-system/commit/3bf512aa1427d9ba1f52e4929abe8360fb1bdddc)]:
  - @uiid/tokens@0.0.31
  - @uiid/typography@0.0.31
  - @uiid/layout@0.0.31
  - @uiid/buttons@0.0.31
  - @uiid/cards@0.0.31
  - @uiid/lists@0.0.31
  - @uiid/overlays@0.0.31
  - @uiid/icons@0.0.31
  - @uiid/utils@0.0.31

## 0.0.30

### Patch Changes

- [#244](https://github.com/uiid-systems/design-system/pull/244) [`f748549`](https://github.com/uiid-systems/design-system/commit/f748549795c163f5888f758ddba74fa1acff5f9f) Thanks [@adamfratino](https://github.com/adamfratino)! - Add a palette-driven `color` prop to Card (one hue resolves background, foreground, and border via oklch + light-dark) and retire the vestigial tone token concept. Form validation (invalid radio/checkbox and the required-field asterisk) now uses the raw `--color-red` primitive instead of the undefined `--tone-critical`.

- Updated dependencies [[`f748549`](https://github.com/uiid-systems/design-system/commit/f748549795c163f5888f758ddba74fa1acff5f9f)]:
  - @uiid/cards@0.0.30
  - @uiid/overlays@0.0.30
  - @uiid/buttons@0.0.30
  - @uiid/icons@0.0.30
  - @uiid/layout@0.0.30
  - @uiid/lists@0.0.30
  - @uiid/tokens@0.0.30
  - @uiid/typography@0.0.30
  - @uiid/utils@0.0.30

## 0.0.29

### Patch Changes

- [#241](https://github.com/uiid-systems/design-system/pull/241) [`60f51d5`](https://github.com/uiid-systems/design-system/commit/60f51d5fb6aac0bb78a2c8714787ab683ef2ca7c) Thanks [@adamfratino](https://github.com/adamfratino)! - Consolidate anchored popup enter/exit animations into a shared `.popup` composition in `@uiid/tokens/compositions.module.css`, composed by Tooltip, Popover, Select, SelectMultiple, Autocomplete, and Combobox. Fixes the previously broken scale (the old `[data-is-popup]` rule referenced an undefined `--globals-transform-scale`, so popups only faded), scales popups from their anchor via Base UI's `--transform-origin`, and applies the shared easing token. Removes the dead `[data-is-popup]` block from `globals.css`.

- [#243](https://github.com/uiid-systems/design-system/pull/243) [`693ad6f`](https://github.com/uiid-systems/design-system/commit/693ad6fd35585601ab18e8f8b09834b0e6b61a6e) Thanks [@adamfratino](https://github.com/adamfratino)! - Add `before`/`after` slot props to Select and SelectMultiple, mirroring Input's slotted-field model. Extract the shared slot styling into a `.field-slot` composition in `@uiid/tokens/compositions.module.css`, now composed by both Input and Select so slot color, icon sizing, pointer pass-through, and size-based edge padding stay consistent across form controls.

- Updated dependencies [[`60f51d5`](https://github.com/uiid-systems/design-system/commit/60f51d5fb6aac0bb78a2c8714787ab683ef2ca7c), [`693ad6f`](https://github.com/uiid-systems/design-system/commit/693ad6fd35585601ab18e8f8b09834b0e6b61a6e)]:
  - @uiid/tokens@0.0.29
  - @uiid/overlays@0.0.29
  - @uiid/buttons@0.0.29
  - @uiid/cards@0.0.29
  - @uiid/layout@0.0.29
  - @uiid/lists@0.0.29
  - @uiid/typography@0.0.29
  - @uiid/icons@0.0.29
  - @uiid/utils@0.0.29

## 0.0.28

### Patch Changes

- [#240](https://github.com/uiid-systems/design-system/pull/240) [`8d30a84`](https://github.com/uiid-systems/design-system/commit/8d30a8458f94682612ac022879f84a981b41bb24) Thanks [@adamfratino](https://github.com/adamfratino)! - Fix `SelectMultiple` ignoring the `size` prop (the trigger now resizes, not just the label). Consolidate the duplicated control size scale (input, button) and the drifting dropdown option states (select, combobox, autocomplete) into shared `composes` sources in `compositions.module.css`. Add a checkmark indicator to the selected `Select` item, and make the `Card` inner container fullwidth so body content spans the card.

- Updated dependencies [[`62d4892`](https://github.com/uiid-systems/design-system/commit/62d489279afcaa7ba8f875ddad2a0b610c051768), [`8d30a84`](https://github.com/uiid-systems/design-system/commit/8d30a8458f94682612ac022879f84a981b41bb24)]:
  - @uiid/cards@0.0.28
  - @uiid/buttons@0.0.28
  - @uiid/tokens@0.0.28
  - @uiid/overlays@0.0.28
  - @uiid/layout@0.0.28
  - @uiid/lists@0.0.28
  - @uiid/typography@0.0.28
  - @uiid/icons@0.0.28
  - @uiid/utils@0.0.28

## 0.0.27

### Patch Changes

- [#235](https://github.com/uiid-systems/design-system/pull/235) [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a) Thanks [@adamfratino](https://github.com/adamfratino)! - Forward the `indeterminate` prop to the underlying Checkbox root so the indeterminate (mixed) state is reflected in the control's state and indicator, not just the icon.

- [#235](https://github.com/uiid-systems/design-system/pull/235) [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a) Thanks [@adamfratino](https://github.com/adamfratino)! - Remove CSS transitions from the Checkbox (the control and the bordered wrapper).

- [#235](https://github.com/uiid-systems/design-system/pull/235) [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a) Thanks [@adamfratino](https://github.com/adamfratino)! - Use `--shade-background` for the unchecked Checkbox fill so it stays visible on tinted surfaces (e.g. striped table rows) where the previous `--forms-bg` blended in.

- [#233](https://github.com/uiid-systems/design-system/pull/233) [`6fdd5df`](https://github.com/uiid-systems/design-system/commit/6fdd5df7f2468ae6a836492845363d58f5dde904) Thanks [@adamfratino](https://github.com/adamfratino)! - Simplify the lists package and prune downstream consumers.
  - **`@uiid/lists`**: replace `type` (ordered/unordered/none), `direction`, and `size` with a single `marker` prop (`"none" | "disc" | "decimal" | "square"`; `decimal` renders `<ol>`, others `<ul>`). Rename `ListItemGroup` → `ListGroup` and export it alongside `ListItem`. `ListItem` now accepts `children`, which override the label/description block. Drop the `content` and `action` slots, the `selected` and `disabled` props (along with the `ListSelectedIcon` subcomponent), the `value` field on `ListItemProps` and the `id` field on `ListGroupProps` (callers no longer need to thread a key through items; map index / category are used), the dead `description` field on `ListGroupProps`, the `HorizontalListProps | VerticalListProps` discriminated union, and all collapsible behavior (Base UI `Collapsible` wiring, `collapsible`/`open`/`defaultOpen`/`onOpenChange` props, the ChevronsUpDown trigger icon). `ListGroup` is now a purely visual grouping with a static header. Add `GroupProps` pass-through on `List` alongside the existing `ItemProps`. Tighten default item padding via tokens. Fixes a latent token-name typo (`--list-group-category-minHeight` → `-min-height`).
  - **`@uiid/forms`**: drop `size` from `AutocompleteListProps`, `ComboboxListProps`, and `SelectListProps`; stop forwarding it to `<List>`. Remove `size` from the `Autocomplete` and `Combobox` roots (its only effect was the list scaling). `Select` keeps `size` on the trigger/value via `InputVariants`. Stop forwarding `selected={state.selected}` from `SelectItem`/`ComboboxItem` to `ListItem` (Base UI's `data-selected` attribute is still set via the renderProps spread). Dropdown list items now render at the default token sizing.
  - **`@uiid/tokens`**: remove the dead `list.size.{sm,md,lg}` block and the orphan `list.padding-x` / `list.padding-y` tokens from `list.tokens.json`.

  Adopt the examples-driven storybook pattern: add `list.examples.tsx` (Default, WithIcons, WithDescriptions, NestedGroups, Markers, Composable) and rewrite the story as a thin shim. Drop the orphaned mock files.

- Updated dependencies [[`0ebdc4c`](https://github.com/uiid-systems/design-system/commit/0ebdc4c14209eece848e8d288e6a814a0e021ca6), [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a), [`0ebdc4c`](https://github.com/uiid-systems/design-system/commit/0ebdc4c14209eece848e8d288e6a814a0e021ca6), [`6fdd5df`](https://github.com/uiid-systems/design-system/commit/6fdd5df7f2468ae6a836492845363d58f5dde904), [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a), [`247daed`](https://github.com/uiid-systems/design-system/commit/247daedd33450a0794ca81a532ba9b0328967a52)]:
  - @uiid/tokens@0.0.27
  - @uiid/cards@0.0.27
  - @uiid/lists@0.0.27
  - @uiid/typography@0.0.27
  - @uiid/buttons@0.0.27
  - @uiid/layout@0.0.27
  - @uiid/overlays@0.0.27
  - @uiid/icons@0.0.27
  - @uiid/utils@0.0.27

## 0.0.26

### Patch Changes

- [`2808033`](https://github.com/uiid-systems/design-system/commit/2808033e3a20be69ed9f20d6d25220244072e7f1) Thanks [@adamfratino](https://github.com/adamfratino)! - simplify breadcrumbs caret

- Updated dependencies [[`2808033`](https://github.com/uiid-systems/design-system/commit/2808033e3a20be69ed9f20d6d25220244072e7f1), [`e740c85`](https://github.com/uiid-systems/design-system/commit/e740c8594ae614462e63543436cc4816c6a7ab02), [`486ea23`](https://github.com/uiid-systems/design-system/commit/486ea2349e200b75f54f2f4073a318f2238376ef)]:
  - @uiid/buttons@0.0.26
  - @uiid/cards@0.0.26
  - @uiid/icons@0.0.26
  - @uiid/layout@0.0.26
  - @uiid/lists@0.0.26
  - @uiid/overlays@0.0.26
  - @uiid/tokens@0.0.26
  - @uiid/typography@0.0.26
  - @uiid/utils@0.0.26

## 0.0.25

### Patch Changes

- Updated dependencies []:
  - @uiid/buttons@0.0.25
  - @uiid/cards@0.0.25
  - @uiid/icons@0.0.25
  - @uiid/layout@0.0.25
  - @uiid/lists@0.0.25
  - @uiid/overlays@0.0.25
  - @uiid/tokens@0.0.25
  - @uiid/typography@0.0.25
  - @uiid/utils@0.0.25

## 0.0.24

### Patch Changes

- Updated dependencies [[`ba0c026`](https://github.com/uiid-systems/design-system/commit/ba0c0265e6b1f19afec07637d73c02d113212016)]:
  - @uiid/cards@0.0.24
  - @uiid/tokens@0.0.24
  - @uiid/overlays@0.0.24
  - @uiid/buttons@0.0.24
  - @uiid/layout@0.0.24
  - @uiid/lists@0.0.24
  - @uiid/typography@0.0.24
  - @uiid/icons@0.0.24
  - @uiid/utils@0.0.24

## 0.0.23

### Patch Changes

- [#214](https://github.com/uiid-systems/design-system/pull/214) [`f4ef8ce`](https://github.com/uiid-systems/design-system/commit/f4ef8ce332a0f1fa88d5323e6105120b972a74b9) Thanks [@adamfratino](https://github.com/adamfratino)! - Introduce `@uiid/tokens/compositions.module.css` as a shared CSS Modules source for `composes`. Adds a `.disabled` class that bundles `opacity: var(--globals-disabled-opacity)` and `pointer-events: none` under the new `uiid.compositions` layer, and converts 14 consumers (input, checkbox, radio, switch, textarea, slider, number-field's increment/decrement, button, code-editor, sidebar-menu-button, sidebar-menu-sub-button, accordion-root, resizable-handle, sortable-item-handle) to compose this source instead of duplicating the rule.

- Updated dependencies [[`1d0c6e2`](https://github.com/uiid-systems/design-system/commit/1d0c6e24e6212f7f12530259110ac1cbc1344c0d), [`de26147`](https://github.com/uiid-systems/design-system/commit/de261474d8621bc40da0e24f20ecdb2f6b921aad), [`f4ef8ce`](https://github.com/uiid-systems/design-system/commit/f4ef8ce332a0f1fa88d5323e6105120b972a74b9), [`10bd3dc`](https://github.com/uiid-systems/design-system/commit/10bd3dc9b358e08278b9b59e0ec4668c97d58c22), [`23351be`](https://github.com/uiid-systems/design-system/commit/23351bef77f49a5e90ace39a8c223441e88cf094), [`101b095`](https://github.com/uiid-systems/design-system/commit/101b0956bedd5690878d910b4e420aa54e9df2a6), [`e61d7f5`](https://github.com/uiid-systems/design-system/commit/e61d7f50c25c96377272aea5c8c071298659fae4)]:
  - @uiid/tokens@0.0.23
  - @uiid/cards@0.0.23
  - @uiid/buttons@0.0.23
  - @uiid/layout@0.0.23
  - @uiid/typography@0.0.23
  - @uiid/lists@0.0.23
  - @uiid/overlays@0.0.23
  - @uiid/icons@0.0.23
  - @uiid/utils@0.0.23

## 0.0.22

### Patch Changes

- Updated dependencies [[`84bb4f9`](https://github.com/uiid-systems/design-system/commit/84bb4f9e2650affe8e617bae0a47579cb609b481)]:
  - @uiid/lists@0.0.22
  - @uiid/buttons@0.0.22
  - @uiid/cards@0.0.22
  - @uiid/icons@0.0.22
  - @uiid/layout@0.0.22
  - @uiid/overlays@0.0.22
  - @uiid/tokens@0.0.22
  - @uiid/typography@0.0.22
  - @uiid/utils@0.0.22

## 0.0.21

### Patch Changes

- Updated dependencies []:
  - @uiid/buttons@0.0.21
  - @uiid/cards@0.0.21
  - @uiid/icons@0.0.21
  - @uiid/layout@0.0.21
  - @uiid/lists@0.0.21
  - @uiid/overlays@0.0.21
  - @uiid/tokens@0.0.21
  - @uiid/typography@0.0.21
  - @uiid/utils@0.0.21

## 0.0.20

### Patch Changes

- Updated dependencies [[`8cb0fb8`](https://github.com/uiid-systems/design-system/commit/8cb0fb80401fb87d3dee4f7efd6936fea6e918c5)]:
  - @uiid/lists@0.0.20
  - @uiid/buttons@0.0.20
  - @uiid/cards@0.0.20
  - @uiid/icons@0.0.20
  - @uiid/layout@0.0.20
  - @uiid/overlays@0.0.20
  - @uiid/tokens@0.0.20
  - @uiid/typography@0.0.20
  - @uiid/utils@0.0.20

## 0.0.19

### Patch Changes

- Updated dependencies [[`e43f0d2`](https://github.com/uiid-systems/design-system/commit/e43f0d28bee9ee88a9ffe4d928344de6962ef2fc)]:
  - @uiid/cards@0.0.19
  - @uiid/overlays@0.0.19
  - @uiid/tokens@0.0.19
  - @uiid/buttons@0.0.19
  - @uiid/layout@0.0.19
  - @uiid/lists@0.0.19
  - @uiid/typography@0.0.19
  - @uiid/icons@0.0.19
  - @uiid/utils@0.0.19

## 0.0.18

### Patch Changes

- [#188](https://github.com/uiid-systems/design-system/pull/188) [`cf359fa`](https://github.com/uiid-systems/design-system/commit/cf359fac1a8343169bf63ad4f16619f8d633b951) Thanks [@adamfratino](https://github.com/adamfratino)! - tinkering

- [#187](https://github.com/uiid-systems/design-system/pull/187) [`274bc07`](https://github.com/uiid-systems/design-system/commit/274bc077ead25d1dd9d25881373561bfd35239e5) Thanks [@adamfratino](https://github.com/adamfratino)! - tinkering

- [#188](https://github.com/uiid-systems/design-system/pull/188) [`cf359fa`](https://github.com/uiid-systems/design-system/commit/cf359fac1a8343169bf63ad4f16619f8d633b951) Thanks [@adamfratino](https://github.com/adamfratino)! - Add color prop to Text component with palette colors (red, orange, yellow, green, blue, indigo, purple, neutral). Move shared palette color system from Badge to Text as the primitive owner. Badge, Status, and other indicator components now consume palette definitions from typography.

- Updated dependencies [[`cf359fa`](https://github.com/uiid-systems/design-system/commit/cf359fac1a8343169bf63ad4f16619f8d633b951)]:
  - @uiid/typography@0.0.18
  - @uiid/buttons@0.0.18
  - @uiid/cards@0.0.18
  - @uiid/layout@0.0.18
  - @uiid/lists@0.0.18
  - @uiid/overlays@0.0.18
  - @uiid/icons@0.0.18
  - @uiid/tokens@0.0.18
  - @uiid/utils@0.0.18

## 0.0.17

### Patch Changes

- [#183](https://github.com/uiid-systems/design-system/pull/183) [`7cbd9c1`](https://github.com/uiid-systems/design-system/commit/7cbd9c109cb59fa559416b393292828593535949) Thanks [@adamfratino](https://github.com/adamfratino)! - Add before/after icon slots to Input, MaskInput, Combobox, and Autocomplete components

- [#180](https://github.com/uiid-systems/design-system/pull/180) [`d61e1d7`](https://github.com/uiid-systems/design-system/commit/d61e1d71fbc5d60fde02768c74e4eca8aa50578d) Thanks [@adamfratino](https://github.com/adamfratino)! - Add size prop (small, medium, large) to List component with form-size-aligned tokens. Wire size through Select, Combobox, and Autocomplete consumers.

- Updated dependencies [[`d61e1d7`](https://github.com/uiid-systems/design-system/commit/d61e1d71fbc5d60fde02768c74e4eca8aa50578d), [`e19fa9c`](https://github.com/uiid-systems/design-system/commit/e19fa9cb3a5bbe7f7e613740fadde507d70031a0)]:
  - @uiid/lists@0.0.17
  - @uiid/tokens@0.0.17
  - @uiid/typography@0.0.17
  - @uiid/layout@0.0.17
  - @uiid/buttons@0.0.17
  - @uiid/cards@0.0.17
  - @uiid/overlays@0.0.17
  - @uiid/icons@0.0.17
  - @uiid/utils@0.0.17

## 0.0.16

### Patch Changes

- [#177](https://github.com/uiid-systems/design-system/pull/177) [`2981db4`](https://github.com/uiid-systems/design-system/commit/2981db4f96237196766636e482920eb1ac4ec709) Thanks [@adamfratino](https://github.com/adamfratino)! - Fix ghost variant specificity so styles apply correctly on Select and Input

- [#173](https://github.com/uiid-systems/design-system/pull/173) [`6e1874a`](https://github.com/uiid-systems/design-system/commit/6e1874a7fcfb20755f418b2c5ea3df07c31dac0b) Thanks [@adamfratino](https://github.com/adamfratino)! - Add neutral color variant and shared PaletteColor system across indicator components. Remove badge inverted variant. Add Kbd active state with hotkey detection. Boost badge/status oklch color saturation. Restyle tabs and toggle-group with filled pill indicator, ghost prop, and remove tabs align prop. Fix input/select specificity conflict.

- Updated dependencies [[`652f428`](https://github.com/uiid-systems/design-system/commit/652f4286b8c56c337f1e6fe12e41ab77f7e52fe6)]:
  - @uiid/tokens@0.0.16
  - @uiid/buttons@0.0.16
  - @uiid/cards@0.0.16
  - @uiid/layout@0.0.16
  - @uiid/lists@0.0.16
  - @uiid/overlays@0.0.16
  - @uiid/typography@0.0.16
  - @uiid/icons@0.0.16
  - @uiid/utils@0.0.16

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @uiid/buttons@0.0.15
  - @uiid/cards@0.0.15
  - @uiid/icons@0.0.15
  - @uiid/layout@0.0.15
  - @uiid/lists@0.0.15
  - @uiid/overlays@0.0.15
  - @uiid/tokens@0.0.15
  - @uiid/typography@0.0.15
  - @uiid/utils@0.0.15

## 0.0.14

### Patch Changes

- Updated dependencies []:
  - @uiid/buttons@0.0.14
  - @uiid/cards@0.0.14
  - @uiid/icons@0.0.14
  - @uiid/layout@0.0.14
  - @uiid/lists@0.0.14
  - @uiid/overlays@0.0.14
  - @uiid/tokens@0.0.14
  - @uiid/typography@0.0.14
  - @uiid/utils@0.0.14

## 0.0.13

### Patch Changes

- [#162](https://github.com/uiid-systems/design-system/pull/162) [`8a1be59`](https://github.com/uiid-systems/design-system/commit/8a1be592a3aec2f8add47df394fee79a2b3feff0) Thanks [@adamfratino](https://github.com/adamfratino)! - badge refactor

- Updated dependencies [[`8a1be59`](https://github.com/uiid-systems/design-system/commit/8a1be592a3aec2f8add47df394fee79a2b3feff0)]:
  - @uiid/tokens@0.0.13
  - @uiid/buttons@0.0.13
  - @uiid/cards@0.0.13
  - @uiid/layout@0.0.13
  - @uiid/lists@0.0.13
  - @uiid/overlays@0.0.13
  - @uiid/typography@0.0.13
  - @uiid/icons@0.0.13
  - @uiid/utils@0.0.13

## 0.0.12

### Patch Changes

- [#150](https://github.com/uiid-systems/design-system/pull/150) [`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4) Thanks [@adamfratino](https://github.com/adamfratino)! - Remove tone system (positive/critical/warning/info) from all components and tokens. Form validation errors now use shade-based styling.

- Updated dependencies [[`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4), [`3a3a4df`](https://github.com/uiid-systems/design-system/commit/3a3a4dffde260e22e7886f74461fcfdb143614c1)]:
  - @uiid/tokens@0.0.12
  - @uiid/buttons@0.0.12
  - @uiid/cards@0.0.12
  - @uiid/typography@0.0.12
  - @uiid/lists@0.0.12
  - @uiid/overlays@0.0.12
  - @uiid/layout@0.0.12
  - @uiid/icons@0.0.12
  - @uiid/utils@0.0.12

## 0.0.11

### Patch Changes

- [#151](https://github.com/uiid-systems/design-system/pull/151) [`e2c1394`](https://github.com/uiid-systems/design-system/commit/e2c13948302371959e2b006de776aeab6c8a3c81) Thanks [@adamfratino](https://github.com/adamfratino)! - Unify form variant styles: add default font-size token, wire switch to tokens, scale checkbox icons per size, add textarea padding-inline, add number-field size prop, and add invalid state to checkbox and radio.

- Updated dependencies [[`e2c1394`](https://github.com/uiid-systems/design-system/commit/e2c13948302371959e2b006de776aeab6c8a3c81)]:
  - @uiid/tokens@0.0.11
  - @uiid/buttons@0.0.11
  - @uiid/cards@0.0.11
  - @uiid/layout@0.0.11
  - @uiid/lists@0.0.11
  - @uiid/overlays@0.0.11
  - @uiid/typography@0.0.11
  - @uiid/icons@0.0.11
  - @uiid/utils@0.0.11

## 0.0.10

### Patch Changes

- [#129](https://github.com/uiid-systems/design-system/pull/129) [`541df17`](https://github.com/uiid-systems/design-system/commit/541df17c59ab21bd6efd7232225c6420599b1015) Thanks [@adamfratino](https://github.com/adamfratino)! - Forms package quality audit: standardize size tokens, add disabled CSS for Radio and Slider, add Field and Slider tests, normalize ref types, add missing CSS token imports. **BREAKING**: Checkbox and Radio `ContainerProps` prop renamed to `FieldProps` for consistency with all other form components.

- Updated dependencies [[`b81e7eb`](https://github.com/uiid-systems/design-system/commit/b81e7ebed447d6e7582ac2f633b5a520714745f9), [`cbc0598`](https://github.com/uiid-systems/design-system/commit/cbc0598b57d1bc2ba14fd1048d925b0af24cee78), [`0af03b7`](https://github.com/uiid-systems/design-system/commit/0af03b75ae17444678846a7a8602200798312b51), [`bf38c58`](https://github.com/uiid-systems/design-system/commit/bf38c58367bfe4c02b7ebc55362d735ac855ff3b), [`e02fb0d`](https://github.com/uiid-systems/design-system/commit/e02fb0ddfd9f07e5f1daba78dfea8dedabe139ef), [`16449d9`](https://github.com/uiid-systems/design-system/commit/16449d922a0664bee47673e2a802af63cfe794da), [`6b81080`](https://github.com/uiid-systems/design-system/commit/6b81080780b4a173873a822bf346404e0381aa43), [`b05f3d3`](https://github.com/uiid-systems/design-system/commit/b05f3d334b12aed413ff49611c2c786c7fb0f994)]:
  - @uiid/lists@0.0.10
  - @uiid/tokens@0.0.10
  - @uiid/buttons@0.0.10
  - @uiid/cards@0.0.10
  - @uiid/layout@0.0.10
  - @uiid/overlays@0.0.10
  - @uiid/typography@0.0.10
  - @uiid/icons@0.0.10
  - @uiid/utils@0.0.10

## 0.0.8

### Patch Changes

- [#91](https://github.com/uiid-systems/design-system/pull/91) [`8678fa2`](https://github.com/uiid-systems/design-system/commit/8678fa2b558299e9eff3885aab9b5345ccc9d83b) Thanks [@adamfratino](https://github.com/adamfratino)! - docs: clean up docs (#91)

- [#95](https://github.com/uiid-systems/design-system/pull/95) [`3989ce1`](https://github.com/uiid-systems/design-system/commit/3989ce127ab06f41ca006dae2681f1c3271fc7a1) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: establish code review workflow and PR review guide (#95)

- [#98](https://github.com/uiid-systems/design-system/pull/98) [`d931595`](https://github.com/uiid-systems/design-system/commit/d9315954b8ef775f8282723079e35b753473d195) Thanks [@adamfratino](https://github.com/adamfratino)! - ci: fix workflows not running on Dependabot PRs (#98)

- [#101](https://github.com/uiid-systems/design-system/pull/101) [`63117da`](https://github.com/uiid-systems/design-system/commit/63117daf62005c6a194d9adc6b82dc89259e034c) Thanks [@adamfratino](https://github.com/adamfratino)! - fix: build (#101)

- [#94](https://github.com/uiid-systems/design-system/pull/94) [`833327c`](https://github.com/uiid-systems/design-system/commit/833327c5056a78b6069e7497966139c4e108982e) Thanks [@adamfratino](https://github.com/adamfratino)! - refactor: simplify versioning and changelog pipeline (#94)

- [#93](https://github.com/uiid-systems/design-system/pull/93) [`4c3ed11`](https://github.com/uiid-systems/design-system/commit/4c3ed11df32fd06d9513bea1b94797327fbafc0f) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: rename playground to blocks, rewrite README, add vision doc (#93)

  ## Summary

- Updated dependencies [[`a411bf3`](https://github.com/uiid-systems/design-system/commit/a411bf3e887a3d8a9722824c3ea2e5096ff08142), [`85038b4`](https://github.com/uiid-systems/design-system/commit/85038b4dc5f10092e508d5a5e3ea39ff3d668cbd), [`3989ce1`](https://github.com/uiid-systems/design-system/commit/3989ce127ab06f41ca006dae2681f1c3271fc7a1), [`d931595`](https://github.com/uiid-systems/design-system/commit/d9315954b8ef775f8282723079e35b753473d195), [`63117da`](https://github.com/uiid-systems/design-system/commit/63117daf62005c6a194d9adc6b82dc89259e034c), [`833327c`](https://github.com/uiid-systems/design-system/commit/833327c5056a78b6069e7497966139c4e108982e), [`4c3ed11`](https://github.com/uiid-systems/design-system/commit/4c3ed11df32fd06d9513bea1b94797327fbafc0f), [`160fe8a`](https://github.com/uiid-systems/design-system/commit/160fe8a27f84bc3035d9b2e85182004491784b88), [`33ba183`](https://github.com/uiid-systems/design-system/commit/33ba1833b162fee82c0dee10c4893e58baef8b7c)]:
  - @uiid/buttons@0.0.8
  - @uiid/tokens@0.0.8
  - @uiid/cards@0.0.8
  - @uiid/icons@0.0.8
  - @uiid/layout@0.0.8
  - @uiid/lists@0.0.8
  - @uiid/overlays@0.0.8
  - @uiid/typography@0.0.8
  - @uiid/utils@0.0.8

## 0.0.7

### Patch Changes

- fix: release again (#89)

## 0.0.6

### Patch Changes

- fix: release (#87)

## 0.0.5

### Patch Changes

- chore: prep all packages for npm publishing (#85)
- feat: add blocks using screenshots (#77)
- docs: update docs (#68)
- feat: add collapsible to registry (#70)
- feat: add icons to playground (#72)
- feat: block registry (#66)
- feat: add more components to registry, separator children, other stuff (#78)
- chore(deps): bump the all-dependencies group across 1 directory with 25 updates (#76)
- refactor: playground enhancements (#82)
- refactor: playground routing (#84)
- fix: json-render migration (#81)

## 0.0.4

### Patch Changes

- refactor: cleanup previews (#52)

## 0.0.3

### Patch Changes

- feat: input-tooltip (#33)
- feat: add mdx support to docs, test on button (#37)
- refactor: cleanup tokens (#45)
- chore(deps-dev): bump vite from 7.1.2 to 7.1.11 (#47)
- chore(deps): bump next from 16.1.3 to 16.1.5 (#48)
- refactor: tokens (#50)
- refactor: automate docs (#40)
- refactor: registry as source of truth (#34)
- feat: link component docs to builder (#35)

## 0.0.2

### Patch Changes

- refactor: swap accent and muted colors (#25)
- fix: changelogs (#20)

## 0.0.1

### Patch Changes

- chore: remove changelog story
- fix: release workflows
