import { Stack, type StackProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "./sidebar-content.module.css";

export const SidebarContent = ({ className, ...props }: StackProps) => {
  return (
    <Stack
      data-slot="sidebar-content"
      gap={2}
      fullwidth
      className={cx(styles["sidebar-content"], className)}
      {...props}
    />
  );
};
SidebarContent.displayName = "SidebarContent";
