import { Stack, type StackProps } from "@uiid/layout";

import styles from "./sidebar-header.module.css";

export const SidebarHeader = ({ ...props }: StackProps) => {
  return (
    <Stack
      data-slot="sidebar-header"
      fullwidth
      px={3}
      py={6}
      className={styles["sidebar-header"]}
      {...props}
    />
  );
};
SidebarHeader.displayName = "SidebarHeader";
