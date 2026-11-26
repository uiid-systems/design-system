import { Menu as BaseMenu } from "@base-ui/react/menu";
import { ListItem } from "@uiid/lists";
import { cx } from "@uiid/utils";

import type { MenuItemProps } from "../menu.types";

import styles from "../menu.module.css";

export const MenuItem = ({
  label,
  description,
  icon,
  className,
  children,
  ...props
}: MenuItemProps) => {
  return (
    <BaseMenu.Item
      data-slot="menu-item"
      label={label}
      {...props}
      className={cx(styles["item"], className)}
    >
      {/* `children` goes through `ListItem`'s own escape hatch rather than
          replacing it, so a custom row keeps the same wrapper. */}
      <ListItem
        render={<div />}
        w="full"
        label={label}
        description={description}
        icon={icon}
      >
        {children}
      </ListItem>
    </BaseMenu.Item>
  );
};
MenuItem.displayName = "MenuItem";
