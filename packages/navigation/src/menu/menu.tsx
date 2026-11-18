"use client";

import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { Group } from "@uiid/layout";

import type { MenuItemProps, MenuItemType, MenuProps } from "./menu.types";
import {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuBackdrop,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  SubmenuRoot,
  SubmenuTrigger,
} from "./subcomponents";

const ItemLabel = ({ icon: Icon, label }: MenuItemType) =>
  Icon ? (
    <Group gap={2} ay="center">
      <Icon size={14} />
      {label}
    </Group>
  ) : (
    label
  );

const renderItem = (item: MenuItemType, ItemProps?: MenuItemProps) => (
  <MenuItem
    key={item.value}
    {...ItemProps}
    disabled={item.disabled ?? ItemProps?.disabled}
    onClick={(event) => {
      ItemProps?.onClick?.(event);
      item.onClick?.(event);
    }}
  >
    <ItemLabel {...item} />
  </MenuItem>
);

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
}: MenuProps) => {
  return (
    <MenuRoot {...RootProps}>
      <MenuTrigger {...TriggerProps}>{trigger}</MenuTrigger>
      <MenuPortal>
        {backdrop && <MenuBackdrop {...BackdropProps} />}
        <MenuPositioner side={side} align={align} {...PositionerProps}>
          <MenuPopup {...PopupProps}>
            {items.map((item) => {
              const submenu = item.items;

              if (submenu) {
                return (
                  <SubmenuRoot key={item.value} {...SubmenuRootProps}>
                    <SubmenuTrigger
                      {...SubmenuTriggerProps}
                      disabled={item.disabled ?? SubmenuTriggerProps?.disabled}
                    >
                      <ItemLabel {...item} />
                      <ChevronRightIcon size={12} />
                    </SubmenuTrigger>
                    <MenuPortal>
                      <MenuPositioner>
                        <MenuPopup>
                          {submenu.map((subitem) =>
                            renderItem(subitem, ItemProps),
                          )}
                        </MenuPopup>
                      </MenuPositioner>
                    </MenuPortal>
                  </SubmenuRoot>
                );
              }

              return renderItem(item, ItemProps);
            })}
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  );
};
Menu.displayName = "Menu";
