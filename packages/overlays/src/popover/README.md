# Popover

> A floating card anchored to a trigger. Title, description, icon, action, and footer are slot props; the children prop fills the body.

Use Popover when you want to:

- Attach rich content to a control without taking over the page — the rest stays visible and usable
- Position it with `PositionerProps` (`side`, `align`, `sideOffset`, `collisionPadding`) — it flips and shifts on its own to stay on screen
- Compose the header from any combination of `icon`, `title`, `description`, and `action`, with a `footer` below the body — the same content API as Dialog
- Hold things a user interacts with: filters, a short form, a set of links

Leave `open` unset and the popover runs itself from the trigger; pass `open` and `onOpenChange` to drive it yourself.

Popover wraps Base UI's [Popover](https://base-ui.com/react/components/popover) and takes its props unchanged — anything not listed above is forwarded.

**Popover or Tooltip?** Popover is click-triggered, focusable, and can contain controls. Tooltip is hover-triggered, holds plain text, and is unreachable by touch — so anything a user must read or act on belongs here, not there.

The popup shares the floating-surface motion used by Select, Combobox, and Tooltip: it scales out of its anchor rather than its own centre.

## Triggers

A string trigger renders as a focusable `<span role="button">`. An element becomes the trigger itself: a `<button>` or `Button` keeps its native button semantics, and any other tag (`<span>`, `<div>`) gets `role="button"` and keyboard handling from Base UI. `PopoverTrigger` treats its children the same way.

A `render` of your own, through `TriggerProps`, replaces that element as it does in Base UI: the trigger renders inside it, and `nativeButton` is yours to set.

Pass a function to follow the open state. It receives Base UI's trigger state (`open`, `disabled`), the same object its `className` and `render` functions get, and its result is content: Popover renders it inside its own focusable trigger, the way it wraps a string, and re-renders it as the state changes.

```tsx
<Popover trigger={({ open }) => <Text>{open ? "Hide" : "Show"} filters</Text>}>
  …
</Popover>
```

Because Popover owns that element, a function trigger is a button whatever it returns. Don't return a `Button` from one — that nests a button inside a button. For a `Button` whose label follows the state, control `open` instead.

A component element can't be inspected before it renders, so it is taken to be a button. Pass `nativeButton={false}` for one that isn't, such as a static `Text` — otherwise Base UI warns, and the trigger is neither announced as a button nor opened by Enter and Space.

```tsx
<Popover trigger={<Text>Filters</Text>} TriggerProps={{ nativeButton: false }}>
  …
</Popover>
```
