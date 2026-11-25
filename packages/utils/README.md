# @uiid/utils

> Shared plumbing for the `@uiid/*` component packages: class merging, `cva` variants, render-prop merging, style props, trigger resolution and a few small helpers.

The package serves the sibling `@uiid/*` packages, so its barrel holds the names another package imports and nothing else; `src/index.test.ts` lists them exactly. It has one entry point, `@uiid/utils`, and no CSS.

Apps don't depend on it. An app reaches `cx` through `@uiid/design-system/utils`, the only name that subpath serves, and `@uiid/design-system` itself does not re-export this package.

## Classes and variants

| Export         | Kind     | Purpose                                                                                                                                                                     |
| -------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cx`           | function | Joins class values with plain concatenation (no Tailwind merging). Returns `undefined` rather than an empty string, and rejects functions as class values at the type level |
| `cva`          | function | [`cva`](https://beta.cva.style) 1.0 beta, re-exported for component `.variants.ts` files                                                                                    |
| `VariantProps` | type     | The variant props of a `cva` function                                                                                                                                       |

## Render props

| Export            | Kind     | Purpose                                                                                                                                                                                                                                                        |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `renderWithProps` | function | Clones a `render` element with the component's props, concatenating `className`, merging `style`, composing refs and chaining event handlers (the component's first, vetoed by `preventDefault()`). Renders `fallbackElement` (`div`) when there is no element |
| `resolveRender`   | function | Unwraps a `render` element that arrives as a lazy node from a server component, so server and client render the same branch                                                                                                                                    |
| `RenderProp`      | type     | The element type `render` accepts                                                                                                                                                                                                                              |
| `useComposedRefs` | hook     | Composes several refs into one stable callback ref                                                                                                                                                                                                             |
| `isRenderable`    | function | Whether React paints anything for a node: `null`, `undefined`, booleans, `""` and arrays of only those are nothing; `0` is content                                                                                                                             |

## Style props

The style-prop system behind `gap`, `p`, `w`, `ax` and the rest. `prepareComponentProps` writes `data-ui-{key}` plus a raw `--props-{key}`, and the generated `@uiid/tokens` `props.css` resolves them; see `.claude/rules/styling.md` at the repo root.

| Export                  | Kind     | Purpose                                                                                                                                       |
| ----------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `prepareComponentProps` | function | Stamps `data-slot`, writes each listed style prop as `data-ui-{key}` and `--props-{key}`, and each listed data prop as a bare `data-ui-{key}` |
| `stylePropKeys`         | array    | Every style prop key: border, layout, spacing and sizing                                                                                      |
| `spacingPropKeys`       | array    | The spacing keys only (`gap`, `m*`, `p*`)                                                                                                     |
| `togglePropKeys`        | array    | The boolean toggles (`evenly`, `wrap`, `grow`)                                                                                                |
| `resolveStyleProp`      | function | The CSS value a style prop paints for a value, for a component that republishes it as its own custom property                                 |
| `BorderProps`           | type     | `b`, `bx`, `by`, `bl`, `br`, `bt`, `bb`: border widths in px                                                                                  |
| `LayoutProps`           | type     | `ax`, `ay`, `direction`, `flex`                                                                                                               |
| `SpacingProps`          | type     | `gap`, `m`, `mx`, `my`, `ml`, `mr`, `mt`, `mb`, `p`, `px`, `py`, `pl`, `pr`, `pt`, `pb`, in multiples of `--spacing-unit`                     |
| `SizingProps`           | type     | `w`, `minw`, `maxw`, `h`, `minh`, `maxh`, taking px or `"full"` / `"screen"`; `w` and `h` also take `null` to release a default size          |
| `ToggleProps`           | type     | `evenly`, `wrap`, `grow`                                                                                                                      |
| `WithLayoutProps`       | type     | A Base UI part's props plus a layout primitive's, keeping every key Base UI ships as Base UI's                                                |
| `WithStringClassName`   | type     | A Base UI part's props with `className` narrowed to a string                                                                                  |

## Props helpers

| Export               | Kind     | Purpose                                                                                                                                      |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `definedProps`       | function | Drops the keys whose value is `undefined`, so top-level props spread after `RootProps` win without erasing the `RootProps` values left unset |
| `splitDomAttributes` | function | Splits props into hyphenated DOM attributes (`aria-*`, `data-*`) and the rest, for a headless Base UI Root that renders no element           |
| `DomAttributes`      | type     | The `aria-*` and `data-*` attributes `splitDomAttributes` returns                                                                            |

## Triggers

| Export                | Kind     | Purpose                                                                                                                                                                                              |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resolveTrigger`      | function | The `render` and `nativeButton` a Base UI trigger part needs for its children: an element is the trigger itself, and a string or a function of the state renders in a focusable `role="button"` span |
| `hasTrigger`          | function | Whether the children, or a caller's own `render`, amount to a trigger, so a composed component can skip its trigger part                                                                             |
| `WithTriggerChildren` | type     | A trigger part's props with `children` widened to a node or a function of the trigger's state                                                                                                        |

## Reveal

Shared by `Reveal` in `@uiid/typography` and `Markdown`'s `reveal` in `@uiid/markdown`, which both animate words with the `[data-animate="reveal"]` rule in `@uiid/tokens`.

| Export                    | Kind     | Purpose                                                                       |
| ------------------------- | -------- | ----------------------------------------------------------------------------- |
| `splitWords`              | function | Splits text before each word, so a whitespace run stays on the word before it |
| `REVEAL_DEFAULT_DURATION` | constant | `400`: each word's fade and blur-in, in ms                                    |
| `REVEAL_DEFAULT_BLUR`     | constant | `6`: the blur radius each word starts from, in px                             |
