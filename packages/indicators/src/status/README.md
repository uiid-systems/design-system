# Status

> A small dot that signals a state, with an optional label as children. Small enough to sit inside a sentence or a button.

Use Status when you want to:

- Show that something is online, busy, failing or idle, with a palette `color` (`green`, `red`, …) on the dot
- Label the dot by passing children, which render as `Text` on step `0` beside it
- Draw attention to a live state with `pulse` — the dot fades and shrinks in a loop, and holds still when the user prefers reduced motion
- Swap an uncoloured dot to the background shade with `inverted`, for a dot on a filled surface

The root is a `<span>` rendered by `Group`, so it is valid inside a paragraph or a button, and it takes layout props (`gap`, `p`, `ay`, …). It defaults to `gap={2}` and `ay="center"`. `className`, `ref` and remaining props reach the root; `color`, `pulse` and `inverted` style the dot only.

Without children the dot is colour alone, which a screen reader cannot see. Give it a name, and a role so the name is announced: `<Status role="img" aria-label="Online" color="green" />`.

For a labelled pill rather than a dot, use [Badge](../badge/README.md).
