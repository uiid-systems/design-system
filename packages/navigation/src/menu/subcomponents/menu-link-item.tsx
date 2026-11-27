import { Menu as BaseMenu } from "@base-ui/react/menu";
import { ListItem } from "@uiid/lists";
import { cx } from "@uiid/utils";

import type { MenuLinkItemProps } from "../menu.types";

import styles from "../menu.module.css";

/*
 * A row that navigates: Base UI's `LinkItem`, a real `<a>`, so middle-click
 * and open in a new tab work. Pass `render` to draw it with a router's link.
 * It wears the same row as `MenuItem`.
 */
export const MenuLinkItem = ({
  label,
  description,
  icon,
  className,
  children,
  ...props
}: MenuLinkItemProps) => {
  return (
    <BaseMenu.LinkItem
      data-slot="menu-link-item"
      label={label}
      {...props}
      className={cx(styles["link-item"], className)}
    >
      <ListItem
        render={<div />}
        w="full"
        label={label}
        description={description}
        icon={icon}
      >
        {children}
      </ListItem>
    </BaseMenu.LinkItem>
  );
};
MenuLinkItem.displayName = "MenuLinkItem";
