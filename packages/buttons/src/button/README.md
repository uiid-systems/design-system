# Button

> The standard action trigger. Filled by default; swap the surface with `variant`, the footprint with `shape`, and the element with `render`.

Use Button when you want to:

- Trigger an action — `onClick` is forwarded straight to the underlying `<button>`
- Match a form-control row with `size` (`xsmall`, `small`, `medium`, `large`)
- Soften the surface with `variant`: `subtle` (low-contrast fill), `ghost` (transparent)
- Tint the button with a palette `color` (`red`, `blue`, …) — solid fill by default, or a soft surface when paired with `variant="subtle"`
- Reshape the footprint with `shape`: `pill` (rounded), `square` (1:1, no padding), `circle` (round, 1:1) — an icon-only `square` or `circle` button takes its accessible name from a string `tooltip`, unless `aria-label` or `aria-labelledby` is already set on the Button or its `render` element
- Show a spinner with `loading` without the button changing size
- Wrap the trigger in a Tooltip via `tooltip` — no manual composition. The tooltip itself is visual only, so on a text button the visible text stays the accessible name
- Stretch to the container with `fullwidth`
- Render as a different element via the `render` prop

Additional props are forwarded to the underlying Base UI Button.

## Links keep link semantics

A `render` that carries an `href` — a plain `<a>` or a router link such as Next's `<Link>` — is treated as a link, not a button. It keeps its `href`, `target`, and `rel`, is announced as a link by screen readers, appears in their list of links, and needs no `nativeButton={false}`.

```tsx
<Button variant="subtle" render={<Link href="/next" />}>
  Next
</Button>
```

Base UI gives a non-native `render` `role="button"`, which is right for a `<span>` or `<div>` standing in for a button and wrong for something that navigates, so Button routes links around it. For a non-link element that really should act as a button, pass `nativeButton={false}` and it behaves exactly as before.

```tsx
<Button nativeButton={false} render={<span />}>
  Acts as a button
</Button>
```

A `render={<button />}` stays a native button, with real `disabled` and its own `type`. A component that renders a `<button>` can't be inspected before it renders, so pass `nativeButton` for one.

A disabled link keeps its `href` — stripping it would break router links — and instead leaves the tab order and ignores activation.

## Gotchas

- A plain Button is `type="button"`, so inside a `<form>` it doesn't submit. Pass `type="submit"` for the one that should.
- `loading` doesn't disable the button: clicks still fire, so guard the handler or pass `disabled` too. While loading, the label is hidden from assistive tech and the button is announced as "Loading".
- With a `tooltip`, the Button sits inside an inline-block wrapper, so `fullwidth` and flex-item props size it within that wrapper rather than the surrounding row.
- On a colored surface, give a ghost button that surface's `color`. A colored ghost hovers one shade deeper than its palette's tint; an uncolored one hovers the neutral `--shade-accent`, which reads as grey on a red card.
- Icons size themselves from the button's `size`: height from `--forms-icon-size`, width auto, with `size="large"` stepping up to `--button-icon-size-large`. Don't size them with a class.
- A string `tooltip` only names a `square` or `circle` button, and a non-string tooltip never names one. Any other icon-only button needs its own `aria-label`.
