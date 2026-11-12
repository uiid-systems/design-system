# Tooltip

> Short descriptive text on hover or focus. The children prop is the text; the trigger prop is what it describes.

Use Tooltip when you want to:

- Explain a control whose purpose isn't obvious from its own label — icon-only buttons are the usual case
- Tune the hover dwell time before it appears with `delay`, in milliseconds (300 by default, the same as Button's `tooltip`)
- Position it with `PositionerProps` (`side`, `align`, `sideOffset`, `collisionPadding`) — it flips and shifts on its own to stay on screen. `sideOffset` (8) and `collisionPadding` (16) keep their defaults when you set only `side` or `align`
- Attach it to anything: an element is used as the trigger itself, and a string or a function of the trigger's state is wrapped in a focusable `role="button"` span

Tooltip wraps Base UI's [Tooltip](https://base-ui.com/react/components/tooltip). Its top-level props are the ones above plus `open` and `onOpenChange`; Tooltip's other root props (`defaultOpen`, `disabled`, …) go through `RootProps`. Slot overrides (`ProviderProps`, `RootProps`, `TriggerProps`, `PortalProps`, `PositionerProps`, `PopupProps`) reach the individual parts.

**On a `Button`, use Button's own `tooltip` prop instead.** It opens on a disabled button's hover as well as its focus, and a string `tooltip` names an icon-only button and describes the rest.

**Only for non-essential, non-interactive text.** A tooltip can't be opened by touch, and Base UI renders it for sighted users only: it isn't announced, and gives the trigger no name or description. Never put a control, a link, or information a user actually needs inside one — use `Popover` — and give the trigger an accessible name of its own.

A Tooltip outside any `TooltipProvider` mounts its own, with `ProviderProps`. Wrap a group of them in a single `TooltipProvider` so that once one is open, moving between neighbouring triggers skips the delay; Tooltips inside it share that provider, and their `ProviderProps` go unused. Button's own `tooltip` mounts its own provider, so Buttons don't group.

The popup inverts its surface — foreground background, background text — which is what separates it visually from `Popover`. It caps its width at `--tooltip-max-width` (15rem) and wraps long unbroken strings, such as URLs, instead of overflowing. Both come from the global `composes-tooltip` composition, which another floating surface can compose to share the treatment.

## Gotchas

- **An element trigger keeps its own semantics.** A `<button>`, a link or a `Button` is already focusable; a `<span>` or a `Text` gets no `tabIndex` from the trigger, so give it one or keyboard users never reach it: `<Tooltip trigger={<Text tabIndex={0}>Net 30</Text>}>`.
- **A disabled `Button` as `trigger` opens on focus only.** Its disabled styling turns off pointer events, so hover never reaches it. Button's `tooltip` prop sits on a wrapper that still takes hover.
- **The content renders inside a size `-1` `Text` span**, so keep it to text and inline elements.
- **Composing from the parts? Put them inside a `TooltipProvider`.** The 300ms default lives on `TooltipProvider`; without one, Base UI's own 600ms applies.
