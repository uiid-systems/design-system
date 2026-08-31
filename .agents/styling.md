# Styling

**Never use `style={{}}` for layout, spacing, sizing, or text styling.** Resolution order:

1. **Component props** — `gap`, `p`, `ax`, `ay`, `evenly`, `fullwidth`, `size`, `shade`, etc.
2. **CSS Modules** — only for visual styling (colors, borders, shadows, animations), `data-*` state styling, pseudo-elements, and complex positioning
3. **Stop and ask** — if no prop exists for what you need. Do not fall back to inline styles.

Use `Stack` / `Group` / `Box` from `@uiid/layout` instead of raw flex or grid CSS, and `Text` from `@uiid/typography` instead of raw text elements. Read their `.types.ts` and `.variants.ts` for current prop values — these change, so do not rely on memorized lists.

Tailwind is acceptable only when no UIID component or prop covers the case.

Dogfood the design system everywhere, including docs, MDX, and examples. If a system component exists for the UI you are rendering, use it rather than hand-styled markup.

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
