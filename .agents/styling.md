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

Spacing props are multiples of `spacing.unit` (`0.25rem`), so `gap={4}` is `1rem`. Token values must be derived from the scale with `calc()`, never hardcoded.

There is no semantic color tone system (no positive/critical/warning/info) — only the shade scale plus palette hues for color variants.
