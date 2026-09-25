# Box

> Foundational layout primitive — a polymorphic div with prop-based layout, spacing, sizing, and border control.

Most teams should reach for [`Stack`](../stack/README.md) or [`Group`](../group/README.md) instead. Box is what they're built on.

Use Box directly when:

- You need full flex control without an opinion about direction
- You need to render as a non-div semantic element (`<section>`, `<form>`, etc.) via the `render` prop
- You're composing a new layout primitive

## Style props

Spacing (`gap`, `p*`, `m*`), sizing (`w`, `h`, `min*`, `max*`), border (`b*`) and alignment (`ax`, `ay`, `direction`) props all take either a value or one per breakpoint:

```tsx
<Box direction={{ base: "column", md: "row" }} gap={{ base: 2, lg: 6 }} />
```

Breakpoints are `sm` (40rem), `md` (48rem), `lg` (64rem) and `xl` (80rem), applied mobile-first; a breakpoint you leave out keeps the value below it.

Toggles `evenly`, `fullwidth`, `fullheight` and `fullscreen` are booleans. For a border, use `b={1}`; for rounded corners or a fixed aspect ratio, use a class.

Style props render as `data-ui-*` attributes resolved by `@uiid/tokens` CSS, so load `@uiid/tokens/globals.css` (or `@uiid/design-system/globals.css`). Your own unlayered CSS overrides them from a class.
