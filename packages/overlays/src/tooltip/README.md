# Tooltip

> Short descriptive text on hover or focus. The children prop is the text; the trigger prop is what it describes.

Use Tooltip when you want to:

- Explain a control whose purpose isn't obvious from its own label — icon-only buttons are the usual case
- Tune the hover dwell time before it appears with `delay`, in milliseconds
- Position it with `PositionerProps` (`side`, `align`, `sideOffset`, `collisionPadding`) — it flips and shifts on its own to stay on screen

Tooltip wraps Base UI's [Tooltip](https://base-ui.com/react/components/tooltip)
and takes its props unchanged — anything not listed above is forwarded.

**Only for non-essential, non-interactive text.** A tooltip can't be opened by
touch and is announced as a description rather than as content, so never put a
control, a link, or information a user actually needs inside one — use `Popover`.
The trigger also still needs its own accessible name: a tooltip supplies a
description, not a label.

Every Tooltip mounts its own provider by default. Wrap a group of them in a
single `TooltipProvider` so that once one is open, moving between neighbouring
triggers skips the delay.

The popup inverts its surface — foreground background, background text — which is
what separates it visually from `Popover`.
