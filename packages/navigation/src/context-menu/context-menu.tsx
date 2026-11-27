"use client";

import { renderMenuItems } from "../menu/render-menu-items";
import { MenuBackdrop, MenuPopup, MenuPortal } from "../menu/subcomponents";
import type { ContextMenuProps } from "./context-menu.types";
import {
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
} from "./subcomponents";

/**
 * A menu that opens at the pointer when `children` are right-clicked or
 * long-pressed. Its rows come from `items`, drawn by the same function Menu
 * uses, so submenus, separators, links and descriptions behave identically.
 */
export const ContextMenu = ({
  /** data */
  items,
  children,
  /** shortcuts */
  backdrop = true,
  /** subcomponents */
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  PositionerProps,
  PopupProps,
  ItemProps,
  SubmenuRootProps,
  SubmenuTriggerProps,
  LinkItemProps,
  SeparatorProps,
  SubmenuPositionerProps,
  SubmenuPopupProps,
}: ContextMenuProps) => {
  return (
    <ContextMenuRoot {...RootProps}>
      <ContextMenuTrigger {...TriggerProps}>{children}</ContextMenuTrigger>
      <MenuPortal {...PortalProps}>
        {backdrop && <MenuBackdrop {...BackdropProps} />}
        <ContextMenuPositioner {...PositionerProps}>
          <MenuPopup {...PopupProps}>
            {renderMenuItems(items, {
              ItemProps,
              SubmenuRootProps,
              SubmenuTriggerProps,
              LinkItemProps,
              SeparatorProps,
              PortalProps,
              SubmenuPositionerProps,
              SubmenuPopupProps,
            })}
          </MenuPopup>
        </ContextMenuPositioner>
      </MenuPortal>
    </ContextMenuRoot>
  );
};
ContextMenu.displayName = "ContextMenu";
