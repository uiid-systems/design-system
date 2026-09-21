# Collapsible

> A panel that opens and closes under a trigger. The trigger can be a string or any element; the children fill the panel.

Use Collapsible when you want to:

- Tuck secondary content — details, advanced settings, a long description — behind a single toggle
- Lay out the root and the panel with the same props as `Stack` (`gap`, `p`, `ax`, `ay`, `fullwidth`, `bordered`, ...) through `RootProps` and `PanelProps`
- Animate the panel's height open and closed, or switch the animation off with `instant`

Leave `open` unset and the collapsible runs itself from the trigger; pass `open` and `onOpenChange` through `RootProps` to drive it yourself, or `defaultOpen` to start it open.

Collapsible wraps Base UI's [Collapsible](https://base-ui.com/react/components/collapsible) and takes its props unchanged — anything not listed above is forwarded through `RootProps`, `TriggerProps`, and `PanelProps`.

## Triggers

A string trigger renders as a focusable `<span role="button">`. An element becomes the trigger itself: a `<button>` or `Button` keeps its native button semantics, and any other tag (`<span>`, `<div>`) gets `role="button"` and keyboard handling from Base UI.

A `render` of your own, through `TriggerProps`, replaces that element as it does in Base UI: the trigger renders inside it, and `nativeButton` is yours to set.

Pass a function to follow the open state. It receives Base UI's trigger state (`open`, `disabled`, `transitionStatus`), the same object its `className` and `render` functions get, and its result is content: Collapsible renders it inside its own focusable trigger, the way it wraps a string, and re-renders it as the state changes.

```tsx
<Collapsible
  trigger={({ open }) => <Text>{open ? "Hide" : "Show"} details</Text>}
>
  …
</Collapsible>
```

Because Collapsible owns that element, a function trigger is a button whatever it returns. Don't return a `Button` from one — that nests a button inside a button. For a `Button` whose label follows the state, control `open` through `RootProps` instead.

A component element can't be inspected before it renders, so it is taken to be a button. Pass `nativeButton={false}` for one that isn't, such as a static `Text` — otherwise Base UI warns, and the trigger is neither announced as a button nor toggled by Enter and Space.

```tsx
<Collapsible
  trigger={<Text>Details</Text>}
  TriggerProps={{ nativeButton: false }}
>
  …
</Collapsible>
```

## Layout

The root and the panel each render a `Stack`, so `RootProps` and `PanelProps` take its layout props alongside Base UI's. The panel aligns its content to the end (`ay="end"`) by default; pass `ay` to change it.

## Composition

`CollapsibleRoot`, `CollapsibleTrigger`, and `CollapsiblePanel` are exported for layouts the simple component can't express, and take the same props as `RootProps`, `TriggerProps`, and `PanelProps`. A bare `CollapsiblePanel` is instant; pass `instant={false}` to animate it.

**Collapsible or Accordion?** Collapsible is one independent panel. [Accordion](../../../navigation/src/accordion/README.md) is a set of them with headings and arrow-key navigation between triggers, and by default opens one at a time.
