# Layer

> Positions multiple children at the same place, optionally offsetting each one by a fixed delta. Use it for overlap effects — stacked avatars, cards in a deck, badges anchored to a thumbnail.

Where [`Stack`](../stack/README.md) and [`Group`](../group/README.md) separate children along an axis, Layer puts them on top of each other. Built on [`Box`](../box/README.md) using `display: grid` so every child claims the same cell. Per-child offsets are computed in CSS via `sibling-index()` — children render as direct DOM siblings, so fragments and component-returning-fragment children work without wrapper elements.

Use Layer when you want to:

- Overlap children at the same position (no offset)
- Cascade children diagonally or along one axis with `offset={{ x, y }}` — each subsequent child translates by `delta × index`
