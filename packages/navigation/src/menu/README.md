# Menu

> A list of actions that opens from a trigger. Pass the entries as `items`; an entry with its own `items` opens a submenu.

Use Menu when you want to:

- Put a set of actions behind one control — a row's overflow button, a toolbar's extra commands
- Nest related actions a level deeper: an entry with `items` opens a submenu beside it
- Place the popup with `side` and `align`

The page dims behind the open menu; pass `backdrop={false}` to leave it undimmed. Base UI's Root is modal either way, so page scroll is locked and outside pointers are blocked.

Menu wraps Base UI's [Menu](https://base-ui.com/react/components/menu) and takes its props unchanged — anything not listed above is forwarded through `RootProps`, `TriggerProps`, `BackdropProps`, `PositionerProps`, `PopupProps`, `ItemProps`, `SubmenuRootProps`, and `SubmenuTriggerProps`. `MenuRoot`, `MenuTrigger`, `MenuPortal`, `MenuBackdrop`, `MenuPositioner`, `MenuPopup`, `MenuItem`, `SubmenuRoot`, and `SubmenuTrigger` are exported for menus the simple component can't express.

`SubmenuTrigger` renders a `Group`, so `SubmenuTriggerProps` takes its layout props (`gap`, `p`, `ax`, `ay`, ...) alongside Base UI's. It defaults to `gap={4}`, `ay="center"`, and `ax="space-between"`, which holds the submenu's chevron at the far edge; pass any of them to change it. A `render` of your own replaces the `Group`, so layout props passed beside it reach your element as plain attributes.

## Triggers

A string trigger renders as a focusable `<span role="button">`. An element becomes the trigger itself: a `<button>` or `Button` keeps its native button semantics and carries the menu's `aria-expanded`, and any other tag (`<span>`, `<div>`) gets `role="button"` and keyboard handling from Base UI. `MenuTrigger` treats its children the same way.

A `render` of your own, through `TriggerProps`, replaces that element as it does in Base UI: the trigger renders inside it, and `nativeButton` is yours to set.

Pass a function to follow the open state. It receives Base UI's trigger state (`open`, `disabled`), the same object its `className` and `render` functions get, and its result is content: Menu renders it inside its own focusable trigger, the way it wraps a string, and re-renders it as the state changes.

```tsx
<Menu
  trigger={({ open }) => <Text>{open ? "Hide" : "Show"} actions</Text>}
  items={items}
/>
```

Because Menu owns that element, a function trigger is a button whatever it returns. Don't return a `Button` from one — that nests a button inside a button. For a `Button` whose label follows the state, control `open` through `RootProps` instead.

A component element can't be inspected before it renders, so it is taken to be a button. Pass `nativeButton={false}` for one that isn't, such as a static `Text` — otherwise Base UI warns, and the trigger is neither announced as a button nor opened by Enter and Space.

```tsx
<Menu
  trigger={<Text>Actions</Text>}
  items={items}
  TriggerProps={{ nativeButton: false }}
/>
```
