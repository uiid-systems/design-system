# Box

> Foundational layout primitive — a polymorphic div with prop-based layout, spacing, sizing, and border control.

Most teams should reach for [`Stack`](../stack/README.md) or [`Group`](../group/README.md) instead. Box is what they're built on.

Use Box directly when:

- You need full flex control without an opinion about direction
- You need to render as a non-div semantic element (`<section>`, `<form>`, etc.) via the `render` prop
- You're composing a new layout primitive

## Style props

Spacing (`gap`, `p*`, `m*`), sizing (`w`, `h`, `min*`, `max*`), border (`b*`), alignment (`ax`, `ay`, `direction`) and `flex` props render as `data-ui-*` attributes resolved by `@uiid/tokens` CSS, so load `@uiid/tokens/globals.css` (or `@uiid/design-system/globals.css`). Your own unlayered CSS overrides them from a class.

Toggles `evenly`, `wrap`, `fullwidth`, `fullheight` and `fullscreen` are booleans. For a border, use `b={1}`; for rounded corners or a fixed aspect ratio, use a class.

`flex` sizes the Box against its siblings: a number is a grow ratio from a zero basis, so `flex={2}` takes twice the space of a `flex={1}` sibling; `"auto"` sizes from content and flexes; `"none"` sizes from content and does not flex. A child that names its own `flex` keeps it inside an `evenly` parent.
