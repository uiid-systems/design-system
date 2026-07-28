# Drawer

> An edge-anchored panel with swipe-to-dismiss and snap points. Title, description, icon, action, and footer are slot props; the children prop fills the body.

Use Drawer when you want to:

- Anchor a panel to any edge — `swipeDirection` (`up`, `down`, `left`, `right`, default `down`) sets both the edge it enters from and the direction a swipe dismisses it
- Let touch users drag the panel away instead of hunting for a close button
- Build a bottom sheet that rests partway open — `snapPoints` takes viewport fractions (`0.3`), pixel values (`400`), or CSS lengths (`"30rem"`)
- Keep the page live behind the panel with `modal={false}`, or trap focus without locking scroll with `modal="trap-focus"`
- Compose the header from any combination of `icon`, `title`, `description`, and `action`, with a `footer` below the body — the same content API as Dialog

Leave `open` unset and the drawer runs itself from the trigger; pass `open` and
`onOpenChange` to drive it yourself.

Drawer wraps Base UI's [Drawer](https://base-ui.com/react/components/drawer) and
takes its props unchanged — anything not listed above is forwarded. There is no
`side` prop and no variant class: edge placement is styled from the
`data-swipe-direction` attribute Base UI puts on the popup.

## Parts

Beyond the usual root/trigger/portal/backdrop, Drawer adds two layers that the
gesture system needs:

- **`DrawerViewport`** — positions the popup, which frees the popup's own `transform` for the drag.
- **`DrawerContent`** — wraps the body so a mouse user can select text inside without the drag becoming a swipe.

`DrawerProvider`, `DrawerIndent`, and `DrawerIndentBackground` are opt-in. Wrap
the app in them to get the indent effect, where the page scales down behind any
open drawer. A standalone drawer needs none of them.

## Caveats

Built on Base UI's `DrawerPreview` namespace — a preview API. `@base-ui/react` is
pinned exactly, so treat any version bump as a review point rather than a routine
update. `Drawer.SwipeArea` (swipe from the edge to *open*) is documented upstream
but is not exported in `1.2.0`, so it isn't surfaced here yet.
