# SwitchRender

> Picks one of two wrapper elements based on a boolean and renders the children inside it. The two-branch sibling of [`ConditionalRender`](../conditional-render/README.md), which is wrap-or-pass-through.

Used internally by [`Separator`](../separator/README.md) to swap between a `Group` (horizontal) and a `Stack` (vertical) without duplicating its children.

Use SwitchRender when you want to:

- Render children inside one of two semantic wrappers based on a prop (e.g. `Stack` vs. `Group`, `<button>` vs. `<a>`, mobile vs. desktop layout)
- Switch the rendered container at runtime without restructuring the JSX
- Avoid writing the same `children` twice in a ternary
