import { Stack, Text } from "@uiid/design-system";

import { ShellBar } from "./bar";
import {
  SIDEBAR_SPACING,
  SHELL_BORDER_WIDTH,
  SHELL_SPACING,
} from "./constants";

import styles from "./shell.module.css";

/**
 * The sidebar column, laid over the leading edge of `AppShellOuter`. It holds
 * no state: it slides out of view when `<html>` carries
 * `data-shell-sidebar="closed"`, and stays mounted while it is closed, so its
 * scroll position and open groups are still there when it comes back.
 * Its width is `--shell-sidebar-width` in shell.module.css.
 */
export const SidebarContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="sidebar"
      render={<aside />}
      className={styles.sidebar}
      br={SHELL_BORDER_WIDTH}
    >
      {children}
    </Stack>
  );
};
SidebarContainer.displayName = "SidebarContainer";

/** Pinned above the scroll track. */
export const SidebarHeader = ({ children }: React.PropsWithChildren) => {
  return (
    <ShellBar data-slot="sidebar-header" px={SIDEBAR_SPACING}>
      <Text weight="bold" size={3}>
        {children}
      </Text>
    </ShellBar>
  );
};
SidebarHeader.displayName = "SidebarHeader";

/** The scroll track: long navigation scrolls here, not on the page. */
export const SidebarScrollContainer = ({
  children,
}: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="sidebar-scroll-container"
      render={<nav />}
      className={styles.scroll}
      gap={SHELL_SPACING}
      p={SIDEBAR_SPACING}
      grow
    >
      {children}
    </Stack>
  );
};
SidebarScrollContainer.displayName = "SidebarScrollContainer";
