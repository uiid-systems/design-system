import { Stack, type StackProps } from "@uiid/layout";

import styles from "./sidebar-footer.module.css";

export const SidebarFooter = ({ ...props }: StackProps) => {
  return (
    <Stack
      data-slot="sidebar-footer"
      fullwidth
      px={3}
      py={6}
      className={styles["sidebar-footer"]}
      {...props}
    />
  );
};
SidebarFooter.displayName = "SidebarFooter";
