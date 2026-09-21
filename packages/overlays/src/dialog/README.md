# Dialog

> A centered modal dialog. Title, description, icon, action, and footer are slot props; the children prop fills the body.

Use Dialog when you want to:

- Interrupt the page for a decision or a focused task — focus is trapped and everything behind it is inert
- Compose the header from any combination of `icon`, `title`, `description`, and `action`, with a `footer` below the body for a row of actions
- Constrain the width with `size` (`small`, `medium`, `large`, `xlarge`) — the dialog stays centered and only the max width changes
- Open from anything: pass an element as `trigger` and it's used as-is, or a string or a function of the open state and it's wrapped in a focusable element — see [Triggers](#triggers)

Leave `open` unset and the dialog runs itself from the trigger; pass `open` and `onOpenChange` to drive it yourself.

Dialog wraps Base UI's [Dialog](https://base-ui.com/react/components/dialog) and takes its props unchanged — anything not listed above is forwarded. Slot overrides (`RootProps`, `TriggerProps`, `PortalProps`, `BackdropProps`, `ViewportProps`, `PopupProps`) reach the individual parts when a slot prop isn't expressive enough.

The popup renders as a `Card`, so its content slots match Drawer and Popover. For a panel anchored to an edge, use `Drawer`; for something attached to a control without blocking the page, use `Popover`.

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
