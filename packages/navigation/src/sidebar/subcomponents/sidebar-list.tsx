import { List, type ListProps } from "@uiid/lists";
import { cx } from "@uiid/utils";

import styles from "./sidebar-list.module.css";

export type SidebarListProps = ListProps;

export const SidebarList = ({
  items,
  className,
  ...props
}: SidebarListProps) => {
  return (
    <List
      data-slot="sidebar-list"
      items={items}
      variant="line"
      gap={2}
      fullwidth
      className={cx(styles["sidebar-list"], className)}
      {...props}
    />
  );
};
SidebarList.displayName = "SidebarList";
