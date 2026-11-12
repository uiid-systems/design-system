# Button

> The standard action trigger. Filled by default; swap the surface with `variant`, the footprint with `shape`, and the element with `render`.

Use Button when you want to:

- Trigger an action — `onClick` is forwarded straight to the underlying `<button>`
- Match a form-control row with `size` (`xsmall`, `small`, `medium`, `large`)
- Soften the surface with `variant`: `subtle` (low-contrast fill), `ghost` (transparent)
- Tint the button with a palette `color` (`red`, `blue`, …) — solid fill by default, or a soft surface when paired with `variant="subtle"`
- Reshape the footprint with `shape`: `pill` (rounded), `square` (1:1, no padding), `circle` (round, 1:1) — an icon-only `square` or `circle` button takes its accessible name from a string `tooltip`, unless `aria-label` or `aria-labelledby` is already set on the Button or its `render` element
- Show a spinner with `loading` without the button changing size
- Wrap the trigger in a Tooltip via `tooltip` — no manual composition. The tooltip itself is visual only, so on a text button the visible text stays the accessible name, and a string `tooltip` becomes its `aria-description` so screen readers hear it without hover
- Stretch to the container with `fullwidth`
- Render as a different element via the `render` prop

Additional props are forwarded to the underlying Base UI Button, or straight to the `render` element when it is a link.

## Links keep link semantics

A `render` that carries an `href` — a plain `<a>` or a router link such as Next's `<Link>` — is treated as a link, not a button. It keeps its `href`, `target`, and `rel`, is announced as a link by screen readers, appears in their list of links, and needs no `nativeButton={false}`.

```tsx
<Button variant="subtle" render={<Link href="/next" />}>
  Next
</Button>
```

Base UI gives a non-native `render` `role="button"`, which is right for a `<span>` or `<div>` standing in for a button and wrong for something that navigates, so Button routes links around it. `href` decides: `nativeButton` is ignored on a link, an `href={undefined}` is no link at all, and a function `render` never takes the link branch. Any other element except a plain `<button>` is emulated as a button without being told to.

```tsx
<Button render={<span />}>Acts as a button</Button>
```

A handler set on the link element runs after the Button's own, so `<Link onClick={track} />` keeps tracking. On a disabled link neither runs.

A `render={<button />}` stays a native button with its own `type`, and no `role="button"` laid over it. A component that renders a `<button>` can't be inspected before it renders, so pass `nativeButton` for one.

A disabled Button stays in the tab order. It is `aria-disabled="true"` rather than natively `disabled`, so a keyboard user can still reach it and read its `tooltip`, and a focused button keeps focus when it becomes disabled. Clicks, Enter and Space do nothing and never reach ancestors or a form. Pass `focusableWhenDisabled={false}` for the native `disabled` attribute and no tab stop.

A disabled link keeps its `href` — stripping it would break router links — and instead ignores activation and its context menu. It stays in the tab order like a disabled button; `focusableWhenDisabled={false}` gives it `tabIndex={-1}`.

In tests, assert `toBeDisabledForUser()` (registered in the root `vitest.setup.ts`), which accepts either native `disabled` or `aria-disabled="true"`. jest-dom's `toBeDisabled()` only sees the native attribute.

## Gotchas

- A plain Button is `type="button"`, so inside a `<form>` it doesn't submit. Pass `type="submit"` for the one that should.
- `loading` doesn't disable the button: clicks still fire, so guard the handler or pass `disabled` too. While loading, the label is hidden from assistive tech and the button is announced as "Loading".
- With a `tooltip`, the Button sits inside an inline-block wrapper, so `fullwidth` and flex-item props size it within that wrapper rather than the surrounding row.
- Color comes from `color`, never a background or border class. One palette hue sets the background, foreground, border and hover together.
- Geometry comes from `size` and `shape`. `square` and `circle` zero the inline padding and force a 1:1 ratio, and `h-*`, `px-*` or `min-w-*` classes fight the size step.
- On a colored surface, give a ghost button that surface's `color`. A colored ghost hovers one shade deeper than its palette's tint; an uncolored one hovers the neutral `--shade-accent`, which reads as grey on a red card.
- Icons size themselves from the button's `size`: height from `--forms-icon-size`, width auto, with `size="large"` stepping up to `--button-icon-size-large`. Don't size them with a class.
- A string `tooltip` only names a `square` or `circle` button, and a non-string tooltip never names one. Any other icon-only button needs its own `aria-label`.
- A string `tooltip` describes the button through `aria-description`, which is how a disabled button says why. It is left off when it would repeat the name (the tooltip already names the button, or matches its text or `aria-label`), when `aria-description` or `aria-describedby` is already set on the Button or its `render` element, and for a non-string tooltip.
- An inferred `nativeButton` holds when a wrapper forwards `nativeButton={undefined}`; only `true` or `false` overrides it.
