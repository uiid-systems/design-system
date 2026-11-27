# ContextMenu

> A menu that opens at the pointer when an area is right-clicked or long-pressed. Pass the same `items` Menu takes and wrap the area, or compose it from three parts of its own and Menu's popup, items and submenus.

Use ContextMenu when you want to:

- Put actions on a thing itself rather than behind a button: a card, a file, a table row, a canvas
- Open the same rows a `Menu` draws, at the pointer instead of under a trigger

```tsx
<ContextMenu items={items} PopupProps={{ "aria-label": "Report actions" }}>
  <Card tabIndex={0} title="Quarterly report" />
</ContextMenu>
```

`items` is the same `MenuItemType[]` array `Menu` takes, and the rows render through the same function, so everything Menu's README says about entries holds here: an entry with `items` opens a submenu beside it, to any depth; an entry with `href` is a real link; `{ type: "separator" }` draws a line; `description` is a second line under the label; an action entry's `onClick` runs after `ItemProps.onClick` and the menu closes; a link entry's `onClick` runs after `LinkItemProps.onClick`, the link navigates, and the menu closes through `closeOnClick`, which `LinkItemProps={{ closeOnClick: false }}` turns off.

`children` is the area that opens the menu. It is wrapped in `ContextMenuTrigger`, whose `<div>` is `display: contents`, so the area keeps the size and place it has in its parent's layout. Where a `<div>` cannot go, such as around a table row, make the area the trigger itself with `TriggerProps={{ render: <TableRow tabIndex={0} /> }}`; `children` then render inside that element.

There is no `trigger`, `side` or `align`: the popup opens at the pointer. A context menu has no trigger button to name its popup, so pass an accessible name through `PopupProps`, as above.

The page dims behind the open menu; pass `backdrop={false}` to leave it undimmed. Only the root menu draws one, never a submenu. A context menu is always modal: Base UI's `ContextMenu.Root` takes no `modal`, so outside pointers are blocked and page scroll is locked whether or not the page is dimmed, and `backdrop` is the only switch. `RootProps={{ modal: false }}` is a type error.

## Slots

Anything not set on ContextMenu itself is forwarded to Base UI through a slot prop. A slot for an element ContextMenu fills omits the keys it fills, so passing one there is a type error: the trigger's content is `children`, every row's content comes from `items`, and ContextMenu fills every portal, positioner and popup itself. `RootProps` stays wide, and `BackdropProps` omits nothing, since the backdrop has no content.

| Slot                     | Reaches                                                          | Takes no                                           |
| ------------------------ | ---------------------------------------------------------------- | -------------------------------------------------- |
| `RootProps`              | The root `ContextMenuRoot`                                       |                                                    |
| `TriggerProps`           | The trigger around `children`                                    | `children`                                         |
| `PortalProps`            | The root portal and every submenu's portal                       | `children`                                         |
| `BackdropProps`          | The backdrop                                                     |                                                    |
| `PositionerProps`        | The root `ContextMenuPositioner`                                 | `children`                                         |
| `PopupProps`             | The root popup                                                   | `children`                                         |
| `ItemProps`              | Every action row, at every depth                                 | `label`, `icon`, `description`, `children`         |
| `LinkItemProps`          | Every link row (each entry with an `href`), at every depth       | `href`, `label`, `icon`, `description`, `children` |
| `SeparatorProps`         | Every separator, at every depth                                  | `children`                                         |
| `SubmenuRootProps`       | Every submenu root, at every depth                               | `children`                                         |
| `SubmenuTriggerProps`    | Every submenu trigger, at every depth                            | `label`, `icon`, `description`, `children`         |
| `SubmenuPositionerProps` | Every submenu's positioner, at every depth, and never the root's | `children`                                         |
| `SubmenuPopupProps`      | Every submenu's popup, at every depth, and never the root's      | `children`                                         |

`RootProps` takes Base UI's root props (`open`, `defaultOpen`, `onOpenChange`, `disabled`, `loopFocus` and the rest). `RootProps.disabled` stops the menu opening and leaves the browser's own context menu in place. `PortalProps={{ container }}` renders the whole menu inside that container. `PopupProps` and `SubmenuPopupProps` take the layout props the popup's `Card` accepts (`p`, `gap`, `w`) and a palette `color`.

## Composing parts

Base UI's [Context Menu](https://base-ui.com/react/components/context-menu) adds only a root, a trigger and a positioner to Menu; its popup, items, groups, separators and submenus are Menu's own. So there are three `ContextMenu*` parts, and everything else is a Menu part: `MenuPortal`, `MenuBackdrop`, `MenuPopup`, `MenuItem`, `MenuLinkItem`, `MenuSeparator`, `MenuGroup`, `MenuGroupLabel`, `MenuCheckboxItem`, `MenuCheckboxItemIndicator`, `MenuRadioGroup`, `MenuRadioItem`, `MenuRadioItemIndicator`, `SubmenuRoot` and `SubmenuTrigger`. Compose them for a menu `items` cannot express, such as one with checkbox or radio rows or groups. A submenu inside a context menu keeps Menu's `MenuPositioner`, which places it beside its trigger row.

```tsx
<ContextMenuRoot>
  <ContextMenuTrigger>
    <Card tabIndex={0} title="Quarterly report" />
  </ContextMenuTrigger>
  <MenuPortal>
    <MenuBackdrop />
    <ContextMenuPositioner>
      <MenuPopup aria-label="Report actions">
        <MenuItem label="Rename" onClick={onRename} />
        <SubmenuRoot>
          <SubmenuTrigger label="Move to" />
          <MenuPortal>
            <MenuPositioner>
              <MenuPopup>
                <MenuItem label="Archive" />
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </SubmenuRoot>
      </MenuPopup>
    </ContextMenuPositioner>
  </MenuPortal>
</ContextMenuRoot>
```

`ContextMenuRoot` wraps Base UI's `ContextMenu.Root` and takes its props unchanged (`open`, `defaultOpen`, `onOpenChange`, `disabled`, `loopFocus` and the rest). It renders no element. `disabled` stops the menu opening and leaves the browser's own context menu in place.

`ContextMenuTrigger` wraps Base UI's `ContextMenu.Trigger`, the area that opens the menu on right-click or a long press. Base UI renders it as a `<div>` around its children; that `<div>` is `display: contents`, so it draws no box and the area keeps exactly the size and place it has in its parent's layout, a stretched flex item included. Pass `render` to make an element the trigger itself instead: `<ContextMenuTrigger render={<Card tabIndex={0} title="Shared folder" />} />`. The rendered element keeps its own box and does not take the `display: contents` class. Because the default trigger has no box, a `tabIndex` or `role` passed to it lands on an element nothing can see or click: put `tabIndex` on the child, or pass `render` so the focusable element is the trigger. While the menu is open the trigger carries `data-popup-open`. A background or outline keyed on that attribute paints nothing on the default trigger, so to style the open area, target its child or use `render`.

`ContextMenuPositioner` wraps Base UI's `ContextMenu.Positioner` and takes its props unchanged. The popup opens at the pointer, with Base UI's own offsets for a context menu, and keeps 16px clear of the viewport edges (`collisionPadding`), as `MenuPositioner` does, so near an edge it shifts or flips to stay on screen.

The trigger and positioner merge a `className` with their own class, so each takes `className` as a string; style their state through the `data-*` attributes Base UI sets.

A context menu has no trigger button to name its popup, so `MenuPopup` renders `role="menu"` with no accessible name of its own. Pass one: `<MenuPopup aria-label="Report actions">`, or `PopupProps={{ "aria-label": "Report actions" }}` on `ContextMenu`.

## Keyboard access

The menu opens on a `contextmenu` event, which fires on the focused element, so a keyboard opens it only when focus is inside the area. Make the area focusable, or put a focusable element inside it: a `Card` with no link takes `tabIndex={0}`, and so does a `TableRow` rendered as the trigger. Focus returns to that element when the menu closes. On Windows and Linux, Shift+F10 or the Menu key sends the event. macOS browsers have no such key; there, only VoiceOver's VO+Shift+M opens the menu from the keyboard.

That is why a context menu should not be the only way to reach an action: put the same actions behind a visible control beside the area, such as a `Menu` button given the same `items`. Keep that control outside `ContextMenu` (or `ContextMenuTrigger` and `ContextMenuRoot`): React events bubble through portals, so a right-click in a dropdown opened from inside the area would also open the context menu over it. For table rows, one button beside the table with a submenu per row keeps the control outside every row.

Focusable table rows have two costs. Each row is a tab stop, so a long table puts many stops between the user and what follows it; there, rely on the control beside the table and leave the rows unfocusable. And Table has no row focus style, so a focused row shows only the browser's default outline, which some browsers clip or do not draw on a table row.
