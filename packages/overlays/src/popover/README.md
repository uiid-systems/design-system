# Popover

> A floating card anchored to a trigger. Title, description, icon, action, and footer are slot props; the children prop fills the body.

Use Popover when you want to:

- Attach rich content to a control without taking over the page — the rest stays visible and usable
- Position it with `PositionerProps` (`side`, `align`, `sideOffset`, `collisionPadding`) — it flips and shifts on its own to stay on screen
- Compose the header from any combination of `icon`, `title`, `description`, and `action`, with a `footer` below the body — the same content API as Dialog
- Hold things a user interacts with: filters, a short form, a set of links

Leave `open` unset and the popover runs itself from the trigger; pass `open` and
`onOpenChange` to drive it yourself.

Popover wraps Base UI's [Popover](https://base-ui.com/react/components/popover)
and takes its props unchanged — anything not listed above is forwarded.

**Popover or Tooltip?** Popover is click-triggered, focusable, and can contain
controls. Tooltip is hover-triggered, holds plain text, and is unreachable by
touch — so anything a user must read or act on belongs here, not there.

The popup shares the floating-surface motion used by Select, Combobox, and
Tooltip: it scales out of its anchor rather than its own centre.
