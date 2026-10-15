# ToggleButton

> A Button with an on/off state. Pair `pressed`/`unpressed` icons or text via the `icon` and `text` props.

Use ToggleButton when you want to:

- Track a binary pressed state — controlled via `pressed` + `onPressedChange`, or uncontrolled via `defaultPressed`
- Swap icons by pressed state with `icon={{ pressed, unpressed }}` — common for favorite/like, follow, theme toggles
- Swap labels by pressed state with `text={{ pressed, unpressed }}` — overrides `children` while the toggle is in that state; if `text` is omitted, `children` renders in both states
- Inherit [Button](../button/README.md)'s styling props: `variant`, `size`, `shape`, `color`, `fullwidth`, `loading`, `tooltip`

ToggleButton owns the element it renders, so it takes no `render` or `nativeButton`, and it is always `type="button"`. Style the pressed state with `[data-pressed]`.

The underlying primitive is Base UI Toggle, so `aria-pressed` is managed automatically and `Enter`/`Space` toggle the state.
