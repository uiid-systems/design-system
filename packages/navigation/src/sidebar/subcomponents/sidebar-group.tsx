import { Stack, type StackProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "./sidebar-group.module.css";

export const SidebarGroup = ({ className, ...props }: StackProps) => {
  return (
    <Stack
      data-slot="sidebar-group"
      fullwidth
      p={2}
      className={cx(styles["sidebar-group"], className)}
      {...props}
    />
  );
};
SidebarGroup.displayName = "SidebarGroup";
