# Dialog

> A centered modal dialog. Title, description, action, and footer are slot props; the children prop fills the body.

Use Dialog when you want to:

- Interrupt the page for a decision or a focused task — focus is trapped and everything behind it is inert
- Compose the header from any combination of `title`, `description`, and `action`, with a `footer` below the body for a row of actions
- Constrain the width with `size` (`small`, `medium`, `large`, `xlarge`) — the dialog stays centered and only the max width changes. `full` instead fills the viewport in both directions, for viewers and inspectors
- Open from anything: pass an element as `trigger` and it's used as-is, or a string or a function of the open state and it's wrapped in a focusable element — see [Triggers](#triggers)

Leave `open` unset and the dialog runs itself from the trigger; pass `open` and `onOpenChange` to drive it yourself.

Dialog wraps Base UI's [Dialog](https://base-ui.com/react/components/dialog) and takes its props unchanged — anything not listed above is forwarded. Slot overrides (`RootProps`, `TriggerProps`, `PortalProps`, `BackdropProps`, `ViewportProps`, `PopupProps`) reach the individual parts when a slot prop isn't expressive enough.

The popup renders as a `Card`, so its content slots match Drawer and Popover. For a panel anchored to an edge, use `Drawer`; for something attached to a control without blocking the page, use `Popover`.

## Close button

Every dialog has a close button in its header, after any `action`: an icon-only ghost `Button` named "Close". Don't build your own, and don't put one in `action`.

`hideCloseButton` leaves it out. Use it only when the user must act before leaving, such as a secret shown once, and give the footer the button that closes it. Escape and a backdrop click still close the dialog either way.

## Triggers

A string trigger renders as a focusable `<span role="button">`. An element becomes the trigger itself: a `<button>` or `Button` keeps its native button semantics, and any other tag (`<span>`, `<div>`) gets `role="button"` and keyboard handling from Base UI. `DialogTrigger` treats its children the same way.

A `render` of your own, through `TriggerProps`, replaces that element as it does in Base UI: the trigger renders inside it, and `nativeButton` is yours to set.

Pass a function to follow the open state. It receives Base UI's trigger state (`open`, `disabled`), the same object its `className` and `render` functions get, and its result is content: Dialog renders it inside its own focusable trigger, the way it wraps a string, and re-renders it as the state changes.

```tsx
<Dialog
  trigger={({ open }) => <Text>{open ? "Hide" : "Show"} preferences</Text>}
>
  …
</Dialog>
```

Because Dialog owns that element, a function trigger is a button whatever it returns. Don't return a `Button` from one — that nests a button inside a button. For a `Button` whose label follows the state, control `open` instead.

A component element can't be inspected before it renders, so it is taken to be a button. Pass `nativeButton={false}` for one that isn't, such as a static `Text` — otherwise Base UI warns, and the trigger is neither announced as a button nor opened by Enter and Space.

```tsx
<Dialog
  trigger={<Text>Preferences</Text>}
  TriggerProps={{ nativeButton: false }}
>
  …
</Dialog>
```

## Opening from elsewhere

Leave `trigger` out and no trigger is rendered at all — not a placeholder, not an empty tab stop. That is the shape for one dialog shared by many openers, such as a list of rows that each open the same detail view. Control `open`, set it from whichever control was pressed, and point `PopupProps.finalFocus` at that control. Base UI returns focus to whatever was focused before the open on its own, but Safari doesn't focus a clicked button, so the ref makes the return explicit.

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

<Dialog
  open={open}
  onOpenChange={setOpen}
  PopupProps={{ finalFocus: returnTo }}
  title="Details"
>
  …
</Dialog>
```

A `render` of your own through `TriggerProps` still counts as a trigger, with or without `trigger`.

## Closing from the footer

A footer button that only dismisses, such as Cancel, is `DialogClose`: a subtle `Button` that closes the dialog itself, so the dialog can stay uncontrolled. It takes `Button`'s props, and runs its own `onClick` before closing.

```tsx
<Dialog
  trigger={<Button>Archive</Button>}
  title="Archive this game?"
  footer={
    <>
      <DialogClose>Cancel</DialogClose>
      <Button color="red" onClick={onArchive}>
        Archive
      </Button>
    </>
  }
>
  …
</Dialog>
```

A button that does work before closing, like a submit that can fail, controls `open` instead — see the `Footer` example.

## Naming and long content

A `title` names the dialog: it renders as an `<h2>` that labels the popup, and a composed title — an icon beside the text — stays that heading, laid out as a row. Without a `title` the dialog has no accessible name, so give it one through `PopupProps={{ "aria-label": "…" }}`.

Content taller than the screen scrolls the viewport rather than running off it, so the header and the footer's actions both stay reachable.
