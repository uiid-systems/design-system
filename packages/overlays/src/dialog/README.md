# Dialog

> A centered modal dialog. Title, description, icon, action, and footer are slot props; the children prop fills the body.

Use Dialog when you want to:

- Interrupt the page for a decision or a focused task — focus is trapped and everything behind it is inert
- Compose the header from any combination of `icon`, `title`, `description`, and `action`, with a `footer` below the body for a row of actions
- Constrain the width with `size` (`small`, `medium`, `large`, `xlarge`) — the dialog stays centered and only the max width changes
- Open from anything: pass an element as `trigger` and it's used as-is, or a string and it's wrapped in a focusable element

Leave `open` unset and the dialog runs itself from the trigger; pass `open` and
`onOpenChange` to drive it yourself.

Dialog wraps Base UI's [Dialog](https://base-ui.com/react/components/dialog) and
takes its props unchanged — anything not listed above is forwarded. Slot
overrides (`RootProps`, `TriggerProps`, `PortalProps`, `BackdropProps`,
`ViewportProps`, `PopupProps`) reach the individual parts when a slot prop isn't
expressive enough.

The popup renders as a `Card`, so its content slots match Drawer and Popover.
For a panel anchored to an edge, use `Drawer`; for something attached to a
control without blocking the page, use `Popover`.
