import { Stack } from "@uiid/design-system";

import { SIDEBAR_BORDER_WIDTH, SIDEBAR_ID } from "../sidebar.constants";
import type { SidebarRootProps } from "../sidebar.types";

/**
 * The sidebar column. It holds no state and doesn't place itself: the `Shell`
 * around it reads `data-sidebar="closed"` on `<html>` and slides it out of
 * view. It stays mounted while it is closed, so its scroll position and open
 * groups are still there when it comes back.
 */
export const SidebarRoot = ({ children, ...props }: SidebarRootProps) => {
  return (
    <Stack
      data-slot="sidebar"
      id={SIDEBAR_ID}
      render={<aside />}
      br={SIDEBAR_BORDER_WIDTH}
      {...props}
    >
      {children}
    </Stack>
  );
};
SidebarRoot.displayName = "SidebarRoot";
