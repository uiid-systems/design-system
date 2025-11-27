import { Stack } from "@uiid/layout";

import styles from "./sidebar-inner.module.css";

export const SidebarInner = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      data-slot="sidebar-inner"
      fullwidth
      fullheight
      className={styles["sidebar-inner"]}
    >
      {children}
    </Stack>
  );
};
SidebarInner.displayName = "SidebarInner";
