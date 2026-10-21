# Tooltip

> Short descriptive text on hover or focus. The children prop is the text; the trigger prop is what it describes.

Use Tooltip when you want to:

- Explain a control whose purpose isn't obvious from its own label — icon-only buttons are the usual case
- Tune the hover dwell time before it appears with `delay`, in milliseconds (300 by default, the same as Button's `tooltip`)
- Position it with `PositionerProps` (`side`, `align`, `sideOffset`, `collisionPadding`) — it flips and shifts on its own to stay on screen. `sideOffset` (8) and `collisionPadding` (16) keep their defaults when you set only `side` or `align`
- Attach it to anything: an element is used as the trigger itself, and a string or a function of the trigger's state is wrapped in a focusable `role="button"` span

Tooltip wraps Base UI's [Tooltip](https://base-ui.com/react/components/tooltip)
and takes its props unchanged — anything not listed above is forwarded.

**Only for non-essential, non-interactive text.** A tooltip can't be opened by
touch and is announced as a description rather than as content, so never put a
control, a link, or information a user actually needs inside one — use `Popover`.
The trigger also still needs its own accessible name: a tooltip supplies a
description, not a label.

A Tooltip outside any `TooltipProvider` mounts its own, with `ProviderProps`.
Wrap a group of them in a single `TooltipProvider` so that once one is open,
moving between neighbouring triggers skips the delay; Tooltips inside it share
that provider, and their `ProviderProps` go unused. Button's own `tooltip`
mounts its own provider, so Buttons don't group.

The popup inverts its surface — foreground background, background text — which is
what separates it visually from `Popover`.
