import { Group, type GroupProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "./sidebar-group-label.module.css";

export const SidebarGroupLabel = ({ className, ...props }: GroupProps) => {
  return (
    <Group
      data-slot="sidebar-group-label"
      ay="center"
      px={2}
      className={cx(styles["sidebar-group-label"], className)}
      {...props}
    />
  );
};
SidebarGroupLabel.displayName = "SidebarGroupLabel";
