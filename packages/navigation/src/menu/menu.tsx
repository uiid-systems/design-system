"use client";

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

/* Each entry's `label` and `icon` are its row's content. They are set after
   the slot spread, and `description` and `children` are cleared, so an
   untyped slot cannot replace them or give every row one shared line. */
const renderItem = (item: MenuItemType, ItemProps?: MenuItemProps) => (
  <MenuItem
    key={item.value}
    {...ItemProps}
    label={item.label}
    icon={item.icon}
    description={undefined}
    children={undefined}
    disabled={item.disabled ?? ItemProps?.disabled}
    onClick={(event) => {
      ItemProps?.onClick?.(event);
      item.onClick?.(event);
    }}
  />
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
        {backdrop && RootProps?.modal !== false && (
          <MenuBackdrop {...BackdropProps} />
        )}
        <MenuPositioner {...PositionerProps} side={side} align={align}>
          <MenuPopup {...PopupProps}>
            {items.map((item) => {
              const submenu = item.items;

              if (submenu) {
                return (
                  <SubmenuRoot key={item.value} {...SubmenuRootProps}>
                    <SubmenuTrigger
                      {...SubmenuTriggerProps}
                      label={item.label}
                      icon={item.icon}
                      description={undefined}
                      children={undefined}
                      disabled={item.disabled ?? SubmenuTriggerProps?.disabled}
                    />
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
