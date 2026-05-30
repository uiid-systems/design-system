# ConditionalRender

> Wraps children in a provided element when a condition is true; otherwise renders the children alone. Hoists the `{cond ? <Wrapper>{kids}</Wrapper> : kids}` pattern out of the JSX so the children only have to be written once.

Pair with [`SwitchRender`](../switch-render/README.md) when you need to choose between two wrappers instead of "wrap or don't."

Use ConditionalRender when you want to:

- Wrap text in a link only when an `href` is provided
- Add an analytics, tracking, or theming wrapper only in certain environments
- Toggle a wrapper element without restructuring the children tree
