# Styling

**Never use `style={{}}` for layout, spacing, sizing, or text styling.** Resolution order:

1. **Component props** — `gap`, `p`, `ax`, `ay`, `evenly`, `fullwidth`, `size`, `shade`, etc.
2. **CSS Modules** — only for visual styling (colors, borders, shadows, animations), `data-*` state styling, pseudo-elements, and complex positioning
3. **Stop and ask** — if no prop exists for what you need. Do not fall back to inline styles.

Use `Stack` / `Group` / `Box` from `@uiid/layout` instead of raw flex or grid CSS, and `Text` from `@uiid/typography` instead of raw text elements. Read their `.types.ts` and `.variants.ts` for current prop values — these change, so do not rely on memorized lists.

Tailwind is acceptable only when no UIID component or prop covers the case.

Dogfood the design system everywhere, including docs, MDX, and examples. If a system component exists for the UI you are rendering, use it rather than hand-styled markup.

## Style props

Style props (spacing, sizing, border, `ax`/`ay`/`direction`) never become inline declarations. `prepareComponentProps` writes `data-ui-{key}` plus a raw `--props-{key}`, and rules in `@layer uiid.props` resolve them. That layer sits after `uiid.components`, so a style prop beats a component's own CSS, and unlayered consumer CSS beats a style prop.

- **`packages/tokens/src/props.css` is generated** from the `styleProps` map in `packages/utils/src/props/`. Never edit it by hand. After changing a definition, run `pnpm generate:props`; CI runs it with `--check` and fails until you do.
- **Every `StyleProp` declares a `unit`**: a token variable (`{ variable: "--spacing-unit" }`), `"px"`, or `"none"` for keyword values.
- **`--props-*` vars are registered with `inherits: false`**, so a child never reads its parent's style prop. Numeric ones are typed `<number>`; a non-number resolves to 0.
- **Test the attribute, not the style**: `expect(el).toHaveAttribute("data-ui-gap", "2")`. The test DOM does not load `props.css`, so `toHaveStyle` on a style prop fails.

## CSS variable naming

```
--{layer}-{property}
--{layer}-{variant}-{property}
--{layer}-state-{state}-{property}
```

## Tokens

Spacing props are multiples of `spacing.unit` (`0.25rem`), so `gap={4}` is `1rem`.

**Token JSON holds primitive values only** — a literal (`"1.25rem"`) or a plain reference to another token (`"{spacing.unit}"`). Never put `calc()` or any other CSS expression in a `$value`. The JSON is the source of truth and is meant to be editable from a UI; an expression in a value breaks that. Tokens flow JSON → CSS, never the reverse. If a value needs arithmetic, do it in the CSS module that consumes the token.

There is no semantic color tone system (no positive/critical/warning/info) — only the shade scale plus palette hues for color variants.
