# Token & Component Staleness Audit

Snapshot of the token layer's health, produced while migrating token generation
to Style Dictionary. Reachability is computed transitively: a token var counts as
live only if some non-token consumer (component CSS module, app CSS, or inline
style) reads it, directly or through a chain of other token vars. A token used
only by another dead token is dead.

**271 generated token vars · 240 reachable · 31 unreachable.**

## Status

Resolved in the Style Dictionary migration:

- Both dangling `{theme.primary}` references deleted along with the tokens
  holding them.
- Both CSS custom property name mismatches fixed at the consumer.
- Orphan pruning added to the build.
- 8 unreachable component tokens deleted (component surface 85 → 77 vars).

Still open: the 12 pass-through aliases in button/switch/table that encode design
intent, the 6 unreachable semantic globals, and `spacing.inline`/`spacing.block`.

| Layer      | Total | Unreachable | % dead |
| ---------- | ----: | ----------: | -----: |
| primitives |   128 |          16 |    13% |
| component  |    85 |           9 |    11% |
| semantic   |    56 |           6 |    11% |
| theme      |     2 |           0 |     0% |

## 1. Confirmed bugs

### Dangling token references

`tabs.tokens.json` referenced `{theme.primary}` twice — from `tabs.indicator.bg`
and `tabs.tab.fg-active`. `theme.tokens.json` defines only `white` and `black`;
there has never been a `theme.primary`. The old generator rewrote the reference
textually to `var(--theme-primary)` without checking it resolved, so both
declarations shipped pointing at an undefined property and were invalid at
computed-value time.

This is the class of bug the old pipeline could not catch. `dtcg.schema.json`
cannot see across files, and the generator's reference-checking code was
unreachable. Style Dictionary fails the build on it.

### CSS custom property name mismatches

Both are camelCase reads of kebab-case definitions, so the declaration is
invalid and dropped:

| Consumer                                            | Reads                     | Actually defined                                        |
| --------------------------------------------------- | ------------------------- | ------------------------------------------------------- |
| `interactive/src/tabs/tabs.module.css:107`          | `--tabs-panel-translateY` | `--tabs-panel-translate-y`                              |
| `forms/src/number-field/number-field.module.css:65` | `--forms-bgActive`        | _nothing_ — forms has `bg`, `bg-hover`, `bg-focus` only |

The tabs one silently disables the panel's `translate3d` entrance transform.

### Orphaned generated CSS

`packages/tokens/src/css/` is gitignored and was never pruned, so deleted token
sources left output behind: `component/sidebar.tokens.css` and
`primitives/colors.generated.tokens.css` have no source JSON and no importer.
The Style Dictionary build now prunes orphans after a successful run.

## 2. Unreachable token vars

Deletion candidates, most-stale first.

### `component/tabs.tokens.css` — 6 of 7 unreachable

`--tabs-indicator-bg`, `--tabs-indicator-border-radius`,
`--tabs-indicator-height`, `--tabs-tab-fg`, `--tabs-tab-fg-active`,
`--tabs-panel-translate-y`

`tabs.module.css` reads only `--tabs-tab-height`. Note `--tabs-panel-translate-y`
is unreachable _because_ of the camelCase typo above — the component does want
it, so fix the consumer rather than delete the token. The other five are
genuinely unconsumed, and two of them are the dangling `{theme.primary}` refs.

The component's own README documents a third naming scheme that matches neither
the tokens nor the CSS (`--tabs-tab-color-active`, `--tabs-indicator-color-bg`).

### `component/avatar.tokens.css` — 2 unreachable

`--avatar-size-sm`, `--avatar-size-lg` (only `md` is consumed)

### `component/code.tokens.css` — 1 unreachable

`--code-min-height`

### `semantic/globals.tokens.css` — 6 unreachable

`--globals-header-height`, `--globals-shadow-lg`, `--globals-transform-origin`,
`--globals-transform-scale-up`, `--globals-transition-duration-fast`,
`--globals-transition-easing-spring`

### `primitives/spacing.tokens.css` — 2 unreachable

`--spacing-inline`, `--spacing-block` — both plain aliases of `{spacing.unit}`.

### `primitives/colors.tokens.css` — 14 unreachable

The `500` and `600` steps across most hues. Unlike the above, an unused step in
a deliberately complete colour ramp is not necessarily stale; treat this as
informational rather than a deletion list.

## 3. Not bugs

Flagged by a naive scan, dismissed on inspection:

- **Runtime-provided properties.** `--shiki-*` are emitted by the Shiki
  highlighter. `--anchor-width`, `--transform-origin`,
  `--collapsible-panel-height`, `--active-tab-*`, `--active-toggle-*`,
  `--toast-*`, `--drawer-swipe-*`, `--drawer-snap-point-offset` are set by Base
  UI at runtime. None are ours to define. _(Worth re-verifying against Base UI
  1.7.0 rather than trusting this list.)_
- **Dynamic names.** `` `var(--shade-${shade})` `` in `resizable.stories.tsx`.
- **Comments.** `--color-blue` appears only in a code comment in `TokenVisual.tsx`.
- **Removed-concept leftovers.** `--primary` / `--primary-hover` in
  `code-block.stories.tsx`, from the retired primary/tone system.
