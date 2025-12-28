"use client";

import { ChevronRightIcon } from "@uiid/icons";

import type { MenuProps } from "./menu.types";

import {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  SubmenuRoot,
  SubmenuTrigger,
} from "./subcomponents";

export const Menu = ({
  trigger,
  align,
  side,
  items,
  RootProps,
  TriggerProps,
  PopupProps,
  PositionerProps,
  ItemProps,
  SubmenuRootProps,
  SubmenuTriggerProps,
}: MenuProps) => {
  return (
    <MenuRoot {...RootProps}>
      <MenuTrigger {...TriggerProps}>{trigger}</MenuTrigger>
      <MenuPortal>
        <MenuPositioner side={side} align={align} {...PositionerProps}>
          <MenuPopup {...PopupProps}>
            {items.map((item) => {
              const submenu = item.items;

              if (submenu) {
                return (
                  <SubmenuRoot key={item.value} {...SubmenuRootProps}>
                    <SubmenuTrigger {...SubmenuTriggerProps}>
                      {item.label}
                      <ChevronRightIcon size={12} />
                    </SubmenuTrigger>
                    <MenuPortal>
                      <MenuPositioner>
                        <MenuPopup>
                          {submenu.map((subitem) => (
                            <MenuItem key={subitem.value}>
                              {subitem.label}
                            </MenuItem>
                          ))}
                        </MenuPopup>
                      </MenuPositioner>
                    </MenuPortal>
                  </SubmenuRoot>
                );
              }

              return (
                <MenuItem key={item.value} {...ItemProps}>
                  {item.label}
                </MenuItem>
              );
            })}
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  );
};
Menu.displayName = "Menu";
