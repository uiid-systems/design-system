# Drawer

> An edge-anchored panel with swipe-to-dismiss and snap points. Title, description, action, and footer are slot props; the children prop fills the body.

Use Drawer when you want to:

- Anchor a panel to any edge — `swipeDirection` (`up`, `down`, `left`, `right`, default `down`) sets both the edge it enters from and the direction a swipe dismisses it
- Let touch users drag the panel away instead of hunting for a close button
- Build a bottom sheet that rests partway open — `snapPoints` takes viewport fractions (`0.3`), pixel values (`400`), or CSS lengths (`"30rem"`)
- Keep the page live behind the panel with `modal={false}`, or trap focus without locking scroll with `modal="trap-focus"`
- Compose the header from any combination of `title`, `description`, and `action`, with a `footer` below the body — the same content API as Dialog

Leave `open` unset and the drawer runs itself from the trigger; pass `open` and `onOpenChange` to drive it yourself. `RootProps.onOpenChange` and the top-level `onOpenChange` both run, `RootProps` first, and cancelling the change in the first skips the second.

Drawer wraps Base UI's [Drawer](https://base-ui.com/react/components/drawer) and takes its props unchanged — anything not listed above is forwarded. There is no `side` prop and no variant class: edge placement is styled from the `data-swipe-direction` attribute Base UI puts on the popup.

## Close button

Every drawer has a close button in its header, after any `action`: an icon-only ghost `Button` named "Close", the same as Dialog's. Don't build your own, and don't put one in `action`.

`hideCloseButton` leaves it out. Use it only when the user must act before leaving, and give the footer the button that closes it. Escape, a backdrop click and a swipe still close the drawer either way.

## Triggers

A string trigger renders as a focusable `<span role="button">`. An element becomes the trigger itself: a `<button>` or `Button` keeps its native button semantics, and any other tag (`<span>`, `<div>`) gets `role="button"` and keyboard handling from Base UI. `DrawerTrigger` treats its children the same way.

A `render` of your own, through `TriggerProps`, replaces that element as it does in Base UI: the trigger renders inside it, and `nativeButton` is yours to set.

Pass a function to follow the open state. It receives Base UI's trigger state (`open`, `disabled`), the same object its `className` and `render` functions get, and its result is content: Drawer renders it inside its own focusable trigger, the way it wraps a string, and re-renders it as the state changes.

```tsx
<Drawer trigger={({ open }) => <Text>{open ? "Hide" : "Show"} details</Text>}>
  …
</Drawer>
```

Because Drawer owns that element, a function trigger is a button whatever it returns. Don't return a `Button` from one — that nests a button inside a button. For a `Button` whose label follows the state, control `open` instead.

A component element can't be inspected before it renders, so it is taken to be a button. Pass `nativeButton={false}` for one that isn't, such as a static `Text` — otherwise Base UI warns, and the trigger is neither announced as a button nor opened by Enter and Space.

```tsx
<Drawer trigger={<Text>Details</Text>} TriggerProps={{ nativeButton: false }}>
  …
</Drawer>
```

## Opening from elsewhere

Leave `trigger` out and no trigger is rendered at all — not a placeholder, not an empty tab stop. That is the shape for one drawer shared by many openers, such as a list of rows that each open the same detail view. Control `open`, set it from whichever control was pressed, and point `PopupProps.finalFocus` at that control. Base UI returns focus to whatever was focused before the open on its own, but Safari doesn't focus a clicked button, so the ref makes the return explicit.

```tsx
const [open, setOpen] = useState(false);
const returnTo = useRef<HTMLElement | null>(null);

<Button
  onClick={(event) => {
    returnTo.current = event.currentTarget;
    setOpen(true);
  }}
>
  View
</Button>

<Drawer
  open={open}
  onOpenChange={setOpen}
  swipeDirection="right"
  PopupProps={{ finalFocus: returnTo }}
  title="Details"
>
  …
</Drawer>
```

A `render` of your own through `TriggerProps` still counts as a trigger, with or without `trigger`.

## Closing from the footer

A footer button that only dismisses, such as Cancel, is `DrawerClose`: a subtle `Button` that closes the drawer itself, so the drawer can stay uncontrolled. It takes `Button`'s props, and runs its own `onClick` before closing. It is a `Button` already, so it takes no `render`: pass `size`, `variant` or `color` to it directly.

```tsx
<Drawer
  trigger={<Button>Edit preferences</Button>}
  title="Preferences"
  footer={<DrawerClose>Cancel</DrawerClose>}
>
  …
</Drawer>
```

## While work is pending

Set `pending` while a request started from the drawer is in flight. Escape, a backdrop click, a swipe toward the edge, the header close button and every `DrawerClose` then can't close the drawer, and the close controls render disabled. A canceled swipe springs back to where it started. Setting `open` to false still closes it, so a submit can close on success without clearing `pending` first.

`pending` doesn't touch the submit button. `loading` only shows the spinner, so give the submit `disabled` as well, or it can be clicked twice:

```tsx
<Drawer
  open={open}
  onOpenChange={setOpen}
  pending={saving}
  title="Preferences"
  footer={
    <>
      <DrawerClose>Cancel</DrawerClose>
      <Button onClick={save} loading={saving} disabled={saving}>
        Save
      </Button>
    </>
  }
>
  …
</Drawer>
```

Don't build this guard yourself in `onOpenChange`, and don't pass `disabled` to `DrawerClose` for it. `pending` covers every way of closing, the header close button and swipe included, and works whether or not `open` is controlled.

## Long content

Content taller than the panel scrolls inside the body. The header and the footer's actions stay in view. A left or right panel is as tall as the screen less its inset, and an up or down panel caps there. The body reaches the panel's side edges and pads itself back in with Card's `--card-padding-inline-start` and `--card-padding-inline-end`, so its scrollbar sits at the surface edge, and it leaves a focus ring's reach above and below its content. Dialog's body scrolls the same way, from the same shared rules. Unlike Dialog and Popover, a drawer keeps its header and footer pinned even on a screen shorter than 30rem, so a drag on the header can still expand a snap-point sheet.

While the body overflows it is a tab stop, so the keyboard can scroll it, and a region named by the title, so a screen reader announces where focus landed. An untitled drawer's body stays a plain tab stop, since a region needs a name. Content added to the body later, such as options that load after the drawer opens, is measured too. A focused body keeps its tab stop until focus leaves, even if it stops overflowing. Because the body is the scroll container, `position: sticky` inside it sticks to the body, and a scroll listener belongs on the body rather than the viewport.

With `snapPoints` and an overflowing body, an upward drag on the body scrolls it rather than expanding the sheet, following Base UI's scroll-edge rule. Drag the header to expand the sheet.

## Parts

Beyond the usual root/trigger/portal/backdrop, Drawer adds two layers that the gesture system needs:

- **`DrawerViewport`** — a fixed full-screen layer the popup is inset against, which frees the popup's own `transform` for the drag.
- **`DrawerContent`** — wraps the body so a mouse user can select text inside without the drag becoming a swipe.

`DrawerSwipeArea` is opt-in too. It's an invisible area that opens the drawer on a swipe from the edge it enters from. Render it inside `DrawerRoot`, outside the portal, and place and size it yourself, such as a narrow strip fixed to that edge. `Drawer` renders none, so compose the parts to use it.

`DrawerProvider`, `DrawerIndent`, and `DrawerIndentBackground` are opt-in. Wrap the app in them to get the indent effect, where the page scales down behind any open drawer. A standalone drawer needs none of them.

## Caveats

Built on Base UI's `Drawer`, stable since 1.3, when it left the `DrawerPreview` namespace. `@base-ui/react` is a peer dependency, and any 1.7 or later 1.x release satisfies it. Drawer runs on the app's own install; the package is developed and tested against 1.7.0.
