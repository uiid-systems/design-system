import { Menu as BaseMenu } from "@base-ui/react/menu";
import { ListItem } from "@uiid/lists";
import { cx } from "@uiid/utils";

import type { MenuRadioItemProps } from "../menu.types";
import { MenuRadioItemIndicator } from "./menu-radio-item-indicator";

import styles from "../menu.module.css";

export const MenuRadioItem = ({
  label,
  description,
  icon,
  className,
  children,
  ...props
}: MenuRadioItemProps) => {
  return (
    <BaseMenu.RadioItem
      data-slot="menu-radio-item"
      label={label}
      {...props}
      className={cx(styles["radio-item"], className)}
    >
      {/* As in `MenuCheckboxItem`: `children` replace the label block inside
          `ListItem` and the indicator after it, and the check below uses the
          same falsy test as `ListItem`'s fallback. */}
      <ListItem
        render={<div />}
        w="full"
        label={label}
        description={description}
        icon={icon}
      >
        {children}
      </ListItem>
      {!children && <MenuRadioItemIndicator />}
    </BaseMenu.RadioItem>
  );
};
MenuRadioItem.displayName = "MenuRadioItem";
