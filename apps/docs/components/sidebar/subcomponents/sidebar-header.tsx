import { Text } from "@uiid/design-system";

import { ShellBar } from "@/components/shell";

import { SIDEBAR_SPACING } from "../sidebar.constants";
import type { SidebarHeaderProps } from "../sidebar.types";

/**
 * The sidebar's title, pinned above its scroll track. It renders through
 * `ShellBar` so it lines up with the page header beside it.
 */
export const SidebarHeader = ({ children, ...props }: SidebarHeaderProps) => {
  return (
    <ShellBar data-slot="sidebar-header" px={SIDEBAR_SPACING} {...props}>
      <Text weight="bold" size={3}>
        {children}
      </Text>
    </ShellBar>
  );
};
SidebarHeader.displayName = "SidebarHeader";
