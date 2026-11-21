import { cx, Stack } from "@uiid/design-system";

import { SIDEBAR_GAP, SIDEBAR_SPACING } from "../sidebar.constants";
import type { SidebarNavProps } from "../sidebar.types";

import styles from "../sidebar.module.css";

/** The sidebar's scroll track: long navigation scrolls here, not on the page. */
export const SidebarNav = ({
  className,
  children,
  ...props
}: SidebarNavProps) => {
  return (
    <Stack
      data-slot="sidebar-nav"
      render={<nav />}
      className={cx(styles["sidebar-nav"], className)}
      gap={SIDEBAR_GAP}
      p={SIDEBAR_SPACING}
      grow
      {...props}
    >
      {children}
    </Stack>
  );
};
SidebarNav.displayName = "SidebarNav";
