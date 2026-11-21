# Badge

> A small, bold label on a filled pill. Marks a count, a state, or a category next to the thing it describes.

Use Badge when you want to:

- Tag an item with a short word or a number — "New", "Beta", "3"
- Set the padding with `size` (`small`, `medium`, `large`); the label stays on step `-1` in bold at every size, and `medium` is the default
- Tint it with a palette `color` (`red`, `blue`, …) — the surface, text and border all come from that hue. Without one it is a solid `foreground` pill with `background` text

The root renders a `Group`, so it takes layout props (`gap`, `p`, `ax`, `ay`, …). It defaults to `gap={1}` and `ay="center"`; pass either to change it. Remaining props are forwarded to the root.

A badge is a `<div>`, so it does not belong inside a paragraph. For an inline dot in running text, use [Status](../status/README.md).

A badge carrying only a number has no meaning for a screen reader on its own. Give it an `aria-label` that says what the number counts, and a `role` so the label is announced: `<Badge role="status" aria-label="3 unread messages">3</Badge>`.

Badge's colour treatment is shared: Avatar reads the same `badgeColorStyles`, so a hue looks the same on both. Padding and radius read the `--badge-*` tokens (`--badge-border-radius`, `--badge-size-{sm,md,lg}-padding-{x,y}`).
