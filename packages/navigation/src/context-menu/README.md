# ContextMenu

> A menu that opens at the pointer when an area is right-clicked or long-pressed. Compose it from three parts of its own and Menu's popup, items and submenus.

Use ContextMenu when you want to:

- Put actions on a thing itself rather than behind a button: a card, a file, a canvas
- Open the same rows a `Menu` draws, at the pointer instead of under a trigger

Base UI's [Context Menu](https://base-ui.com/react/components/context-menu) adds only a root, a trigger and a positioner to Menu; its popup, items, groups, separators and submenus are Menu's own. So there are three `ContextMenu*` parts, and everything else is a Menu part: `MenuPortal`, `MenuBackdrop`, `MenuPopup`, `MenuItem`, `MenuLinkItem`, `MenuSeparator`, `MenuGroup`, `MenuGroupLabel`, `MenuCheckboxItem`, `MenuCheckboxItemIndicator`, `MenuRadioGroup`, `MenuRadioItem`, `MenuRadioItemIndicator`, `SubmenuRoot` and `SubmenuTrigger`. A submenu inside a context menu keeps Menu's `MenuPositioner`, which places it beside its trigger row.

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

A context menu has no trigger button to name its popup, so `MenuPopup` renders `role="menu"` with no accessible name of its own. Pass one: `<MenuPopup aria-label="Report actions">`.

## Keyboard access

The menu opens on a `contextmenu` event, which fires on the focused element, so a keyboard opens it only when focus is inside the area. Make the area focusable, or put a focusable element inside it: a `Card` with no link takes `tabIndex={0}`. Focus returns to that element when the menu closes. On Windows and Linux, Shift+F10 or the Menu key sends the event. macOS browsers have no such key; there, only VoiceOver's VO+Shift+M opens the menu from the keyboard.

That is why a context menu should not be the only way to reach an action: put the same actions behind a visible control beside the area, such as a `Menu` button. Keep that control outside `ContextMenuTrigger` and `ContextMenuRoot`: React events bubble through portals, so a right-click in a dropdown opened from inside the area would also open the context menu over it.
