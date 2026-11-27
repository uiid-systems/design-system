# Menu

> A list of actions that opens from a trigger. Pass the entries as `items`; an entry with its own `items` opens a submenu. For menus the array can't express, compose the parts.

Use Menu when you want to:

- Put a set of actions behind one control — a row's overflow button, a toolbar's extra commands
- Nest related actions deeper: an entry with `items` opens a submenu beside it, and an entry in a submenu can have `items` of its own, to any depth
- Mix in links, separators and secondary lines without leaving the `items` array
- Toggle settings or pick one of several options, with composed checkbox and radio rows
- Place the popup with `side` and `align`

Menu wraps Base UI's [Menu](https://base-ui.com/react/components/menu) and takes its props unchanged. It comes in two forms: `Menu`, which draws the whole tree from a `trigger` and an `items` array, and the parts it is built from, exported for composing by hand.

## Items or parts

Reach for `items` first. It covers action rows, links, separators, descriptions and submenus at any depth, and the slots for rows and submenus (`ItemProps`, `LinkItemProps`, `SubmenuTriggerProps` and the rest) reach every level at once, so one `ItemProps` styles every action row at any depth.

Compose the parts when the menu needs something the array has no entry for:

- Groups under a label — `MenuGroup` and `MenuGroupLabel`. In `items`, an entry with its own `items` is a submenu, not a group
- Toggles and one-of-many choices — `MenuCheckboxItem`, `MenuRadioGroup` and `MenuRadioItem`
- Per-submenu state — `SubmenuRootProps` reaches every submenu at once, so an `open` passed there controls all of them together
- A row drawn from your own `children` in place of its `icon` / `label` / `description` block, or a link drawn by its own router component

## Entries

Each entry takes a `label` and a `value` (its key, so it must be unique among its siblings), plus an optional `icon` drawn before the label, `disabled`, and `onClick`. `disabled` and `onClick` are Base UI's Item props; an entry's `disabled` wins over the slot's, and its own `onClick` runs after `ItemProps.onClick`, which applies to every item, submenu items at any depth included.

```tsx
<Menu
  trigger="Actions"
  items={[
    { label: "Edit", value: "edit", icon: PencilIcon, onClick: onEdit },
    {
      label: "Delete",
      value: "delete",
      disabled: !canDelete,
      onClick: onDelete,
    },
  ]}
/>
```

An entry's `description` is a second line stacked under its label, on a submenu's trigger too. It is text inside the row, so it joins the row's accessible name: `{ label: "Copy link", description: "Anyone with the link can view" }` is announced as "Copy link Anyone with the link can view".

### Submenus

An entry with `items` opens a submenu beside it, and its entries can have `items` of their own, to any depth. On such an entry, `disabled` applies to the submenu's trigger and `onClick` is ignored. `SubmenuRootProps` and `SubmenuTriggerProps` reach every submenu at every depth at once, so an `open` passed there controls all of them together; for per-submenu state, compose the parts.

### Links

An entry with an `href` is a link: it renders through `MenuLinkItem`, Base UI's `LinkItem`, as a real `<a role="menuitem">`, so middle-click and open in a new tab work, at any depth. It looks and highlights like any other row. Its `onClick` still runs, after `LinkItemProps.onClick`, and the link still navigates. A link cannot also open a submenu, and Base UI's `LinkItem` takes no `disabled`, so an entry with `href` and `items`, or `href` and `disabled`, is a type error.

A link entry closes the menu when clicked, as an action row does, so a router or hash link does not leave the modal menu open over the new view; pass `LinkItemProps={{ closeOnClick: false }}` to keep it open. A `target="_blank"` passed through `LinkItemProps` gives no sign that a link opens a new window, so add that cue yourself, for example in the entry's `description`.

```tsx
<Menu
  trigger="Account"
  items={[
    { label: "Settings", value: "settings", href: "/settings" },
    { label: "Sign out", value: "sign-out", onClick: signOut },
  ]}
/>
```

### Separators

An entry `{ type: "separator" }` draws a line between sets of entries, at any depth. It renders through `MenuSeparator`, Base UI's menu `Separator` drawn by the layout `Separator`, as an element with `role="separator"` that the arrow keys skip and that takes no highlight. It is the only entry kind with a `type`, and it has no `value`, `label` or other content: it is keyed by its position.

Because a separator has no `label` or `value`, those fields read as `string | undefined` off a `MenuItemType`, and `onClick` is not on a separator at all, so `item.onClick` does not compile until the entry is narrowed; narrow with `item.type !== "separator"` before using `label` or `value` as a string or reading `onClick`.

```tsx
<Menu
  trigger="Actions"
  items={[
    { label: "Edit", value: "edit" },
    { label: "Duplicate", value: "duplicate" },
    { type: "separator" },
    { label: "Delete", value: "delete" },
  ]}
/>
```

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

## Backdrop and modal

The page dims behind the open menu; pass `backdrop={false}` to leave it undimmed. Base UI's Root is modal by default, so page scroll is locked and outside pointers are blocked whether or not the page is dimmed. A non-modal menu, `RootProps={{ modal: false }}`, blocks nothing and draws no backdrop, whatever `backdrop` is set to. Only the root menu draws one, so a submenu opening over its parent does not darken the page a second time.

## Slots

Anything not set on Menu itself is forwarded to Base UI through a slot prop. Each slot except `RootProps` omits the keys Menu fills itself, so passing one there is a type error: `side` and `align` are top-level props, the content of the trigger and of every row comes from `trigger` and `items`, and Menu fills every portal, positioner and popup itself.

| Slot                     | Reaches                                                          | Takes no                                           |
| ------------------------ | ---------------------------------------------------------------- | -------------------------------------------------- |
| `RootProps`              | The root `MenuRoot`                                              |                                                    |
| `PortalProps`            | The root portal and every submenu's portal                       | `children`                                         |
| `TriggerProps`           | The trigger                                                      | `children`                                         |
| `BackdropProps`          | The backdrop                                                     |                                                    |
| `PositionerProps`        | The root positioner                                              | `side`, `align`, `children`                        |
| `PopupProps`             | The root popup                                                   | `children`                                         |
| `ItemProps`              | Every action row, at every depth                                 | `label`, `icon`, `description`, `children`         |
| `LinkItemProps`          | Every link row (each entry with an `href`), at every depth       | `href`, `label`, `icon`, `description`, `children` |
| `SeparatorProps`         | Every separator, at every depth                                  | `children`                                         |
| `SubmenuRootProps`       | Every submenu root, at every depth                               | `children`                                         |
| `SubmenuTriggerProps`    | Every submenu trigger, at every depth                            | `label`, `icon`, `description`, `children`         |
| `SubmenuPositionerProps` | Every submenu's positioner, at every depth, and never the root's | `children`                                         |
| `SubmenuPopupProps`      | Every submenu's popup, at every depth, and never the root's      | `children`                                         |

`PortalProps={{ container }}` renders the whole menu inside that container. `PopupProps` and `SubmenuPopupProps` take the layout props the popup's `Card` accepts (`p`, `gap`, `w`) and a palette `color`.

## Composing parts

`MenuRoot`, `MenuTrigger`, `MenuPortal`, `MenuBackdrop`, `MenuPositioner`, `MenuPopup`, `MenuItem`, `MenuLinkItem`, `MenuSeparator`, `MenuGroup`, `MenuGroupLabel`, `MenuCheckboxItem`, `MenuCheckboxItemIndicator`, `MenuRadioGroup`, `MenuRadioItem`, `MenuRadioItemIndicator`, `SubmenuRoot`, and `SubmenuTrigger` are exported for menus the simple component can't express. Compose `MenuSeparator` between parts for the same line a separator entry draws.

```tsx
<MenuRoot>
  <MenuTrigger>
    <Button>Actions</Button>
  </MenuTrigger>
  <MenuPortal>
    <MenuBackdrop />
    <MenuPositioner>
      <MenuPopup>
        <MenuItem label="Edit" icon={PencilIcon} />
        <MenuSeparator />
        <MenuItem label="Delete" icon={Trash2Icon} />
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</MenuRoot>
```

`MenuLinkItem` takes Base UI's `render`, so a router's link component can draw the row: `<MenuLinkItem render={<Link to="/settings" />} label="Settings" />`. A composed `MenuLinkItem` keeps Base UI's default of `closeOnClick={false}`.

`SubmenuTrigger` renders a `Group`, so `SubmenuTriggerProps` takes its layout props (`gap`, `p`, `ax`, `ay`, ...) alongside Base UI's. It defaults to `gap={4}`, `ay="center"`, and `ax="space-between"`, which holds the submenu's chevron at the far edge; pass any of them to change it. A `render` of your own replaces the `Group`, so layout props passed beside it reach your element as plain attributes.

### Groups

`MenuGroup` and `MenuGroupLabel` wrap Base UI's `Group` and `GroupLabel` and take their props unchanged. A group renders `role="group"`, named by its label, which is painted like Select's group label. Groups are composed only: in `items`, an entry with its own `items` is a submenu, not a group.

### Checkbox items

`MenuCheckboxItem` wraps Base UI's `CheckboxItem` and takes its props unchanged (`checked`, `defaultChecked`, `onCheckedChange`, `closeOnClick`, `disabled`). It renders `role="menuitemcheckbox"`, a row with `label`, `description` and `icon` like `MenuItem`, and Select's check at the end of the row. As in Base UI, `closeOnClick` is `false`, so the menu stays open after a toggle. An unchecked row keeps its indicator's space, so labels in a mixed list stay aligned, and a checked, disabled row keeps its check, dimmed with the row. Checkbox items are composed only; `items` does not express them.

`children` replace the `icon` / `label` / `description` block inside the row's `ListItem` wrapper, which stays, and drop the check drawn after it; place a `MenuCheckboxItemIndicator` among them to keep the check, laid out with the rest of `children` inside that wrapper. The indicator wraps Base UI's `CheckboxItemIndicator` and defaults `keepMounted` to `true`, which is what holds the space.

```tsx
<MenuCheckboxItem
  label="Status"
  checked={showStatus}
  onCheckedChange={setShowStatus}
/>
```

### Radio items

`MenuRadioGroup` and `MenuRadioItem` wrap Base UI's `RadioGroup` and `RadioItem` and take their props unchanged (`value`, `defaultValue`, `onValueChange` and `disabled` on the group; `value`, `closeOnClick` and `disabled` on the item). Each item renders `role="menuitemradio"`; choosing one sets the group's value, checks it and unchecks its siblings. The row is laid out exactly like a checkbox item's, with `label`, `description` and `icon` and the same check at the end, so radio and checkbox rows in one menu line up. As in Base UI, `closeOnClick` is `false`, so the menu stays open after a choice. An unselected row keeps its indicator's space, and a selected, disabled row keeps its check, dimmed with the row. Radio items are composed only; `items` does not express them.

`children` take over the row as on `MenuCheckboxItem`; place a `MenuRadioItemIndicator` among them to keep the check. The indicator wraps Base UI's `RadioItemIndicator` and defaults `keepMounted` to `true`.

```tsx
<MenuRadioGroup value={sort} onValueChange={setSort}>
  <MenuRadioItem value="name" label="Name" />
  <MenuRadioItem value="updated" label="Last updated" />
</MenuRadioGroup>
```
