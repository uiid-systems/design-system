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
- Render as a different element (`<a>`, `<span>`, etc.) via the `render` prop with `nativeButton={false}` — useful for link buttons; the link keeps its `href`, `target`, and `rel`

Additional props are forwarded to the underlying Base UI Button.
