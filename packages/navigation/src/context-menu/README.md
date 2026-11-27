# ContextMenu

> A menu that opens at the pointer when an area is right-clicked or long-pressed. Compose it from three parts of its own and Menu's popup, items and submenus.

Use ContextMenu when you want to:

- Put actions on a thing itself rather than behind a button: a card, a file, a canvas
- Open the same rows a `Menu` draws, at the pointer instead of under a trigger

Base UI's [Context Menu](https://base-ui.com/react/components/context-menu) adds only a root, a trigger and a positioner to Menu; its popup, items, groups, separators and submenus are Menu's own. So there are three `ContextMenu*` parts, and everything inside the portal is a Menu part: `MenuPortal`, `MenuBackdrop`, `MenuPopup`, `MenuItem`, `MenuLinkItem`, `MenuSeparator`, `MenuGroup`, `MenuGroupLabel`, `MenuCheckboxItem`, `MenuRadioGroup`, `MenuRadioItem`, `SubmenuRoot` and `SubmenuTrigger`. A submenu inside a context menu keeps Menu's `MenuPositioner`, which places it beside its trigger row.

```tsx
<ContextMenuRoot>
  <ContextMenuTrigger>
    <Card title="Quarterly report" />
  </ContextMenuTrigger>
  <MenuPortal>
    <MenuBackdrop />
    <ContextMenuPositioner>
      <MenuPopup>
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

`ContextMenuTrigger` wraps Base UI's `ContextMenu.Trigger`, the area that opens the menu on right-click or a long press. Base UI renders it as a `<div>` around its children; that `<div>` is `display: contents`, so it draws no box and the area keeps exactly the size and place it has in its parent's layout, a stretched flex item included. Pass `render` to make an element the trigger itself instead: `<ContextMenuTrigger render={<Card title="Shared folder" />} />`. The rendered element keeps its own box and does not take the `display: contents` class. While the menu is open the trigger carries `data-popup-open`.

`ContextMenuPositioner` wraps Base UI's `ContextMenu.Positioner` and takes its props unchanged. The popup opens at the pointer, with Base UI's own offsets for a context menu, and keeps 16px clear of the viewport edges (`collisionPadding`), as `MenuPositioner` does, so near an edge it shifts or flips to stay on screen.

The trigger and positioner merge a `className` with their own class, so each takes `className` as a string; style their state through the `data-*` attributes Base UI sets.
