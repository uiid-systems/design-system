"use client";

import type { MenuProps } from "./menu.types";
import { renderMenuItems } from "./render-menu-items";
import {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuBackdrop,
  MenuPositioner,
  MenuPopup,
} from "./subcomponents";

export const Menu = ({
  /** data */
  items,
  /** shortcuts */
  trigger,
  align,
  side,
  backdrop = true,
  /** subcomponents */
  RootProps,
  TriggerProps,
  BackdropProps,
  PopupProps,
  PositionerProps,
  ItemProps,
  SubmenuRootProps,
  SubmenuTriggerProps,
  PortalProps,
  SubmenuPositionerProps,
  SubmenuPopupProps,
}: MenuProps) => {
  return (
    <MenuRoot {...RootProps}>
      <MenuTrigger {...TriggerProps}>{trigger}</MenuTrigger>
      <MenuPortal {...PortalProps}>
        {backdrop && RootProps?.modal !== false && (
          <MenuBackdrop {...BackdropProps} />
        )}
        <MenuPositioner {...PositionerProps} side={side} align={align}>
          <MenuPopup {...PopupProps}>
            {renderMenuItems(items, {
              ItemProps,
              SubmenuRootProps,
              SubmenuTriggerProps,
              PortalProps,
              SubmenuPositionerProps,
              SubmenuPopupProps,
            })}
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  );
};
Menu.displayName = "Menu";
