import { isValidElement } from "react";
import { Menu as BaseMenu } from "@base-ui-components/react/menu";

import { Group } from "@uiid/layout";
import { ChevronRightIcon } from "@uiid/icons";

import { cx } from "@uiid/utils";

import type { MenuProps } from "./menu.types";
import styles from "./menu.module.css";

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
}: MenuProps) => {
  const triggerIsEl = isValidElement(trigger);

  return (
    <BaseMenu.Root {...RootProps}>
      <BaseMenu.Trigger
        {...TriggerProps}
        render={<div tabIndex={triggerIsEl ? -1 : 0} />}
        nativeButton={false}
      >
        {trigger}
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          className={styles.Positioner}
          collisionPadding={16}
          side={side}
          align={align}
          {...PositionerProps}
        >
          <BaseMenu.Popup className={styles["popup"]} {...PopupProps}>
            {items.map((item) => {
              const submenu = item.items;

              if (submenu) {
                return (
                  <BaseMenu.SubmenuRoot key={item.value}>
                    <BaseMenu.SubmenuTrigger
                      className={styles.SubmenuTrigger}
                      render={<Group gap={4} ay="center" ax="space-between" />}
                    >
                      {item.label}
                      <ChevronRightIcon size={12} />
                    </BaseMenu.SubmenuTrigger>
                    <BaseMenu.Portal>
                      <BaseMenu.Positioner
                        className={cx(
                          styles.Positioner,
                          PositionerProps?.className,
                        )}
                      >
                        <BaseMenu.Popup
                          className={cx(styles["popup"], PopupProps?.className)}
                        >
                          {submenu.map((subitem) => (
                            <BaseMenu.Item
                              key={subitem.value}
                              className={cx(styles.Item, ItemProps?.className)}
                              {...ItemProps}
                            >
                              {subitem.label}
                            </BaseMenu.Item>
                          ))}
                        </BaseMenu.Popup>
                      </BaseMenu.Positioner>
                    </BaseMenu.Portal>
                  </BaseMenu.SubmenuRoot>
                );
              }

              return (
                <BaseMenu.Item
                  key={item.value}
                  className={cx(styles.Item, ItemProps?.className)}
                  {...ItemProps}
                >
                  {item.label}
                </BaseMenu.Item>
              );
            })}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
};
Menu.displayName = "Menu";
