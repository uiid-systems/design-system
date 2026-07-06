# @uiid/tokens

## 0.0.28

### Patch Changes

- [#240](https://github.com/uiid-systems/design-system/pull/240) [`8d30a84`](https://github.com/uiid-systems/design-system/commit/8d30a8458f94682612ac022879f84a981b41bb24) Thanks [@adamfratino](https://github.com/adamfratino)! - Fix `SelectMultiple` ignoring the `size` prop (the trigger now resizes, not just the label). Consolidate the duplicated control size scale (input, button) and the drifting dropdown option states (select, combobox, autocomplete) into shared `composes` sources in `compositions.module.css`. Add a checkmark indicator to the selected `Select` item, and make the `Card` inner container fullwidth so body content spans the card.

## 0.0.27

### Patch Changes

- [#234](https://github.com/uiid-systems/design-system/pull/234) [`0ebdc4c`](https://github.com/uiid-systems/design-system/commit/0ebdc4c14209eece848e8d288e6a814a0e021ca6) Thanks [@adamfratino](https://github.com/adamfratino)! - Remove the hardcoded `--theme-primary` color from the global anchor style so links inherit their surrounding text color by default.

- [#233](https://github.com/uiid-systems/design-system/pull/233) [`6fdd5df`](https://github.com/uiid-systems/design-system/commit/6fdd5df7f2468ae6a836492845363d58f5dde904) Thanks [@adamfratino](https://github.com/adamfratino)! - Simplify the lists package and prune downstream consumers.
  - **`@uiid/lists`**: replace `type` (ordered/unordered/none), `direction`, and `size` with a single `marker` prop (`"none" | "disc" | "decimal" | "square"`; `decimal` renders `<ol>`, others `<ul>`). Rename `ListItemGroup` → `ListGroup` and export it alongside `ListItem`. `ListItem` now accepts `children`, which override the label/description block. Drop the `content` and `action` slots, the `selected` and `disabled` props (along with the `ListSelectedIcon` subcomponent), the `value` field on `ListItemProps` and the `id` field on `ListGroupProps` (callers no longer need to thread a key through items; map index / category are used), the dead `description` field on `ListGroupProps`, the `HorizontalListProps | VerticalListProps` discriminated union, and all collapsible behavior (Base UI `Collapsible` wiring, `collapsible`/`open`/`defaultOpen`/`onOpenChange` props, the ChevronsUpDown trigger icon). `ListGroup` is now a purely visual grouping with a static header. Add `GroupProps` pass-through on `List` alongside the existing `ItemProps`. Tighten default item padding via tokens. Fixes a latent token-name typo (`--list-group-category-minHeight` → `-min-height`).
  - **`@uiid/forms`**: drop `size` from `AutocompleteListProps`, `ComboboxListProps`, and `SelectListProps`; stop forwarding it to `<List>`. Remove `size` from the `Autocomplete` and `Combobox` roots (its only effect was the list scaling). `Select` keeps `size` on the trigger/value via `InputVariants`. Stop forwarding `selected={state.selected}` from `SelectItem`/`ComboboxItem` to `ListItem` (Base UI's `data-selected` attribute is still set via the renderProps spread). Dropdown list items now render at the default token sizing.
  - **`@uiid/tokens`**: remove the dead `list.size.{sm,md,lg}` block and the orphan `list.padding-x` / `list.padding-y` tokens from `list.tokens.json`.

  Adopt the examples-driven storybook pattern: add `list.examples.tsx` (Default, WithIcons, WithDescriptions, NestedGroups, Markers, Composable) and rewrite the story as a thin shim. Drop the orphaned mock files.

- [#235](https://github.com/uiid-systems/design-system/pull/235) [`14ac344`](https://github.com/uiid-systems/design-system/commit/14ac344da71d78f844123208532fb81a33cadc6a) Thanks [@adamfratino](https://github.com/adamfratino)! - Table now renders its own Card-based surface (border, radius, fill, shadow) and a differentiated inverted header. Fixes header token variable names that previously referenced undefined CSS variables, and drops the bottom border on the last body row.

## 0.0.26

### Patch Changes

- [`2808033`](https://github.com/uiid-systems/design-system/commit/2808033e3a20be69ed9f20d6d25220244072e7f1) Thanks [@adamfratino](https://github.com/adamfratino)! - simplify breadcrumbs caret

- [#229](https://github.com/uiid-systems/design-system/pull/229) [`e740c85`](https://github.com/uiid-systems/design-system/commit/e740c8594ae614462e63543436cc4816c6a7ab02) Thanks [@adamfratino](https://github.com/adamfratino)! - Trim the buttons package: rewrite both READMEs (button, toggle-button) in short-form, add `button.examples.tsx` and `toggle-button.examples.tsx` consumed by per-variant Storybook stories + a Playground each, add Buttons Overview / Button / Toggle Button MDX docs, regenerate `button.tokens.css` to drop the dead `--button-border-width`, `--button-border-radius`, and `--button-padding-y` vars, and tighten both test files (parameterized matrices, dropped redundant and class-name-only assertions, focused toggle-button tests on the toggle-specific behavior).

- Updated dependencies [[`2808033`](https://github.com/uiid-systems/design-system/commit/2808033e3a20be69ed9f20d6d25220244072e7f1)]:
  - @uiid/themes@0.0.4

## 0.0.25

## 0.0.24

### Patch Changes

- [#222](https://github.com/uiid-systems/design-system/pull/222) [`ba0c026`](https://github.com/uiid-systems/design-system/commit/ba0c0265e6b1f19afec07637d73c02d113212016) Thanks [@adamfratino](https://github.com/adamfratino)! - Polish `Card`: rebuild header conditional rendering so empty cells and the inner container no longer reserve phantom space. Move description out of the title lockup; the header + description are wrapped in a `Stack(gap=2)` only when both are present. Lift icon and header-cell sizing into CSS via `--card-icon-size` and drop `card.constants.ts`. Remove the orphan `size` variant — the `--card-size-*-max-width` CSS references never matched the sm/md/lg tokens and no consumer used it. `CardTitle` drops inline `minHeight`/`alignContent` and switches `weight` from `bold` to `semibold`. `CardFooter` gains a leading `Separator`.

## 0.0.23

### Patch Changes

- [#220](https://github.com/uiid-systems/design-system/pull/220) [`1d0c6e2`](https://github.com/uiid-systems/design-system/commit/1d0c6e24e6212f7f12530259110ac1cbc1344c0d) Thanks [@adamfratino](https://github.com/adamfratino)! - Tighten `Badge` sizing to feel sane at `small`. Reduces padding-y across all sizes (small `0.375rem` → `0.125rem`), trims padding-x on medium/large, drops border-radius from `0.5rem` → `0.375rem`, and adds a new `--badge-line-height` token (`1.25`) applied to both `.badge` and `.badge-text` so the inner `<Text>` no longer forces 1.5 line-height padding into the box. The small badge now lands around 18–20px tall — proportional to shadcn's default badge.

- [#214](https://github.com/uiid-systems/design-system/pull/214) [`f4ef8ce`](https://github.com/uiid-systems/design-system/commit/f4ef8ce332a0f1fa88d5323e6105120b972a74b9) Thanks [@adamfratino](https://github.com/adamfratino)! - Introduce `@uiid/tokens/compositions.module.css` as a shared CSS Modules source for `composes`. Adds a `.disabled` class that bundles `opacity: var(--globals-disabled-opacity)` and `pointer-events: none` under the new `uiid.compositions` layer, and converts 14 consumers (input, checkbox, radio, switch, textarea, slider, number-field's increment/decrement, button, code-editor, sidebar-menu-button, sidebar-menu-sub-button, accordion-root, resizable-handle, sortable-item-handle) to compose this source instead of duplicating the rule.

- [#218](https://github.com/uiid-systems/design-system/pull/218) [`101b095`](https://github.com/uiid-systems/design-system/commit/101b0956bedd5690878d910b4e420aa54e9df2a6) Thanks [@adamfratino](https://github.com/adamfratino)! - Internal cleanup. Delete the duplicate `src/schema/theme-input.ts`, `src/schema/__tests__/`, and `src/schema/examples/` left over from when the schema migrated to `@uiid/themes` in #132. The public `./schema` export continues to re-export from `@uiid/themes/schema` via `src/schema/index.ts` — no API change for consumers.

- [#217](https://github.com/uiid-systems/design-system/pull/217) [`e61d7f5`](https://github.com/uiid-systems/design-system/commit/e61d7f50c25c96377272aea5c8c071298659fae4) Thanks [@adamfratino](https://github.com/adamfratino)! - Fix Card referencing dead CSS vars (`--text-0-weight`, `--text-0-letterSpacing`) left over from the typography refit in #212 — corrected to `--text-0-font-weight` and `--text-0-letter-spacing`. Migrate `typography.tokens.json` to the DTCG composite `$type: "typography"` token format and teach the generator to decompose composite tokens into per-property CSS vars; the emitted CSS output is unchanged.

## 0.0.22

## 0.0.21

## 0.0.20

## 0.0.19

### Patch Changes

- Updated dependencies [[`0460113`](https://github.com/uiid-systems/design-system/commit/0460113c452a26e70dfa7f75061546e13a34ff76)]:
  - @uiid/themes@0.0.3

## 0.0.18

## 0.0.17

### Patch Changes

- [#180](https://github.com/uiid-systems/design-system/pull/180) [`d61e1d7`](https://github.com/uiid-systems/design-system/commit/d61e1d71fbc5d60fde02768c74e4eca8aa50578d) Thanks [@adamfratino](https://github.com/adamfratino)! - Add size prop (small, medium, large) to List component with form-size-aligned tokens. Wire size through Select, Combobox, and Autocomplete consumers.

- [#181](https://github.com/uiid-systems/design-system/pull/181) [`e19fa9c`](https://github.com/uiid-systems/design-system/commit/e19fa9cb3a5bbe7f7e613740fadde507d70031a0) Thanks [@adamfratino](https://github.com/adamfratino)! - Add `uiid.primitives` CSS layer for typography and layout packages to fix cascade ordering issues when consuming the design system

## 0.0.16

### Patch Changes

- [#175](https://github.com/uiid-systems/design-system/pull/175) [`652f428`](https://github.com/uiid-systems/design-system/commit/652f4286b8c56c337f1e6fe12e41ab77f7e52fe6) Thanks [@adamfratino](https://github.com/adamfratino)! - accordion cleanup

## 0.0.15

## 0.0.14

## 0.0.13

### Patch Changes

- [#162](https://github.com/uiid-systems/design-system/pull/162) [`8a1be59`](https://github.com/uiid-systems/design-system/commit/8a1be592a3aec2f8add47df394fee79a2b3feff0) Thanks [@adamfratino](https://github.com/adamfratino)! - badge refactor

## 0.0.12

### Patch Changes

- [#150](https://github.com/uiid-systems/design-system/pull/150) [`cac4e08`](https://github.com/uiid-systems/design-system/commit/cac4e08c36279836e8bee85ccc26dd260fba4db4) Thanks [@adamfratino](https://github.com/adamfratino)! - Remove tone system (positive/critical/warning/info) from all components and tokens. Form validation errors now use shade-based styling.

- [#149](https://github.com/uiid-systems/design-system/pull/149) [`3a3a4df`](https://github.com/uiid-systems/design-system/commit/3a3a4dffde260e22e7886f74461fcfdb143614c1) Thanks [@adamfratino](https://github.com/adamfratino)! - Unify transition tokens across all components to use shared semantic globals

## 0.0.11

### Patch Changes

- [#151](https://github.com/uiid-systems/design-system/pull/151) [`e2c1394`](https://github.com/uiid-systems/design-system/commit/e2c13948302371959e2b006de776aeab6c8a3c81) Thanks [@adamfratino](https://github.com/adamfratino)! - Unify form variant styles: add default font-size token, wire switch to tokens, scale checkbox icons per size, add textarea padding-inline, add number-field size prop, and add invalid state to checkbox and radio.

## 0.0.10

### Patch Changes

- [#127](https://github.com/uiid-systems/design-system/pull/127) [`0af03b7`](https://github.com/uiid-systems/design-system/commit/0af03b75ae17444678846a7a8602200798312b51) Thanks [@adamfratino](https://github.com/adamfratino)! - Refactor List `variant` prop to boolean `line` prop, add `description` to ListItemGroupProps, add `icon-size` token, and remove duplicate stylesheet

- [#120](https://github.com/uiid-systems/design-system/pull/120) [`bf38c58`](https://github.com/uiid-systems/design-system/commit/bf38c58367bfe4c02b7ebc55362d735ac855ff3b) Thanks [@adamfratino](https://github.com/adamfratino)! - Simplify CSS layer system: collapse token sub-layers into flat `uiid.tokens`, remove unused `uiid.utilities` layer, and add consistent `cssLayer` wrapping to all component packages

- [#131](https://github.com/uiid-systems/design-system/pull/131) [`e02fb0d`](https://github.com/uiid-systems/design-system/commit/e02fb0ddfd9f07e5f1daba78dfea8dedabe139ef) Thanks [@adamfratino](https://github.com/adamfratino)! - Add WCAG AA contrast validation to theme generation pipeline and resolve theme variant tokens to static light-dark() values instead of runtime color-mix()

- [#122](https://github.com/uiid-systems/design-system/pull/122) [`16449d9`](https://github.com/uiid-systems/design-system/commit/16449d922a0664bee47673e2a802af63cfe794da) Thanks [@adamfratino](https://github.com/adamfratino)! - Replace raw hex in theme.secondary with color primitive alias

- [#123](https://github.com/uiid-systems/design-system/pull/123) [`6b81080`](https://github.com/uiid-systems/design-system/commit/6b81080780b4a173873a822bf346404e0381aa43) Thanks [@adamfratino](https://github.com/adamfratino)! - Route tone tokens through theme tier for consumer customization

- [#126](https://github.com/uiid-systems/design-system/pull/126) [`b05f3d3`](https://github.com/uiid-systems/design-system/commit/b05f3d334b12aed413ff49611c2c786c7fb0f994) Thanks [@adamfratino](https://github.com/adamfratino)! - Add user theme input schema (Zod) and build-time theme CSS generation pipeline

- Updated dependencies [[`868b793`](https://github.com/uiid-systems/design-system/commit/868b79369eef51c492efee857946595175504e91), [`f1fb926`](https://github.com/uiid-systems/design-system/commit/f1fb926d40d5beead17d520f58a4d680e2f094f1)]:
  - @uiid/themes@0.0.2

## 0.0.8

### Patch Changes

- [#97](https://github.com/uiid-systems/design-system/pull/97) [`a411bf3`](https://github.com/uiid-systems/design-system/commit/a411bf3e887a3d8a9722824c3ea2e5096ff08142) Thanks [@adamfratino](https://github.com/adamfratino)! - refactor(ui): refactor Button API for Figma parity (#97)

- [#99](https://github.com/uiid-systems/design-system/pull/99) [`85038b4`](https://github.com/uiid-systems/design-system/commit/85038b4dc5f10092e508d5a5e3ea39ff3d668cbd) Thanks [@adamfratino](https://github.com/adamfratino)! - fix: button props (#99)

- [#95](https://github.com/uiid-systems/design-system/pull/95) [`3989ce1`](https://github.com/uiid-systems/design-system/commit/3989ce127ab06f41ca006dae2681f1c3271fc7a1) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: establish code review workflow and PR review guide (#95)

- [#98](https://github.com/uiid-systems/design-system/pull/98) [`d931595`](https://github.com/uiid-systems/design-system/commit/d9315954b8ef775f8282723079e35b753473d195) Thanks [@adamfratino](https://github.com/adamfratino)! - ci: fix workflows not running on Dependabot PRs (#98)

- [#94](https://github.com/uiid-systems/design-system/pull/94) [`833327c`](https://github.com/uiid-systems/design-system/commit/833327c5056a78b6069e7497966139c4e108982e) Thanks [@adamfratino](https://github.com/adamfratino)! - refactor: simplify versioning and changelog pipeline (#94)

- [#93](https://github.com/uiid-systems/design-system/pull/93) [`4c3ed11`](https://github.com/uiid-systems/design-system/commit/4c3ed11df32fd06d9513bea1b94797327fbafc0f) Thanks [@adamfratino](https://github.com/adamfratino)! - chore: rename playground to blocks, rewrite README, add vision doc (#93)

  ## Summary

- [#100](https://github.com/uiid-systems/design-system/pull/100) [`33ba183`](https://github.com/uiid-systems/design-system/commit/33ba1833b162fee82c0dee10c4893e58baef8b7c) Thanks [@adamfratino](https://github.com/adamfratino)! - clean up tokens

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
- feat: add icons to playground (#72)
- refactor: cleanup list, docs, text (#73)
- feat: block registry (#66)
- feat: add more components to registry, separator children, other stuff (#78)
- chore(deps): bump the all-dependencies group across 1 directory with 25 updates (#76)
- refactor: playground enhancements (#82)
- refactor: tokens (#75)
- refactor: playground routing (#84)
- fix: json-render migration (#81)
- feat: add accordion (#71)

## 0.0.4

### Patch Changes

- refactor: more playground tinkering (#64)
- refactor: cleanup previews (#52)
- fix: preview link to playground (#54)

## 0.0.3

### Patch Changes

- feat: input-tooltip (#33)
- feat: add mdx support to docs, test on button (#37)
- refactor: cleanup tokens (#45)
- chore(deps): bump next from 16.1.3 to 16.1.5 (#48)
- refactor: tokens (#50)
- feat: link component docs to builder (#35)

## 0.0.2

### Patch Changes

- refactor: swap accent and muted colors (#25)
- fix: changelogs (#20)
- feat: add code editor component (#23)
- feat: json render page (#26)
- feat: add json-render chat (#27)
- feat: add `code` package, shiki (#22)

## 0.0.1

### Patch Changes

- chore: remove changelog story
- fix: react hook errors
- feat: add blocks package, newsletter block
- fix: release workflows
