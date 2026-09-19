# Button

> The standard action trigger. Filled by default; swap the surface with `variant`, the footprint with `shape`, and the element with `render`.

Use Button when you want to:

- Trigger an action — `onClick` is forwarded straight to the underlying `<button>`
- Match a form-control row with `size` (`xsmall`, `small`, `medium`, `large`)
- Soften the surface with `variant`: `subtle` (low-contrast fill), `ghost` (transparent)
- Tint the button with a palette `color` (`red`, `blue`, …) — solid fill by default, or a soft surface when paired with `variant="subtle"`
- Reshape the footprint with `shape`: `pill` (rounded), `square` (1:1, no padding), `circle` (round, 1:1) — pair `shape="square"` with `aria-label` for icon-only buttons
- Show a spinner with `loading` without the button changing size
- Wrap the trigger in a Tooltip via `tooltip` — no manual composition
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

A disabled link keeps its `href` — stripping it would break router links — and instead leaves the tab order and ignores activation.
