# ToggleButton

> A Button with an on/off state. Pair `pressed`/`unpressed` icons or text via the `icon` and `text` props.

Use ToggleButton when you want to:

- Track a binary pressed state — controlled via `pressed` + `onPressedChange`, or uncontrolled via `defaultPressed`
- Swap icons by pressed state with `icon={{ pressed, unpressed }}` — common for favorite/like, follow, theme toggles
- Swap labels by pressed state with `text={{ pressed, unpressed }}` — overrides `children` while the toggle is in that state; if `text` is omitted, `children` renders in both states
- Inherit everything from [Button](../button/README.md): `variant`, `size`, `shape`, `fullwidth`, `loading`, `tooltip`, `render`

The underlying primitive is Base UI Toggle, so `aria-pressed` is managed automatically and `Enter`/`Space` toggle the state.
