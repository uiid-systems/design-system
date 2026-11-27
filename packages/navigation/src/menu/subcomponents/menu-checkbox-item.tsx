import { Menu as BaseMenu } from "@base-ui/react/menu";
import { ListItem } from "@uiid/lists";
import { cx } from "@uiid/utils";

import type { MenuCheckboxItemProps } from "../menu.types";
import { MenuCheckboxItemIndicator } from "./menu-checkbox-item-indicator";

import styles from "../menu.module.css";

export const MenuCheckboxItem = ({
  label,
  description,
  icon,
  className,
  children,
  ...props
}: MenuCheckboxItemProps) => {
  return (
    <BaseMenu.CheckboxItem
      data-slot="menu-checkbox-item"
      label={label}
      {...props}
      className={cx(styles["checkbox-item"], className)}
    >
      {/* `children` take over the whole row, the indicator included, so a
          custom row places its own `MenuCheckboxItemIndicator`. */}
      <ListItem
        render={<div />}
        w="full"
        label={label}
        description={description}
        icon={icon}
      >
        {children}
      </ListItem>
      {children === undefined && <MenuCheckboxItemIndicator />}
    </BaseMenu.CheckboxItem>
  );
};
MenuCheckboxItem.displayName = "MenuCheckboxItem";
