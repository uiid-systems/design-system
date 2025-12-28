import { Menu as BaseMenu } from "@base-ui/react/menu";

import { cx } from "@uiid/utils";

import type { MenuItemProps } from "../menu.types";
import styles from "../menu.module.css";

export const MenuItem = ({ className, children, ...props }: MenuItemProps) => {
  return (
    <BaseMenu.Item
      data-slot="menu-item"
      className={cx(styles["item"], className)}
      {...props}
    >
      {children}
    </BaseMenu.Item>
  );
};
MenuItem.displayName = "MenuItem";
