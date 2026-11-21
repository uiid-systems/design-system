import {
  CollapsiblePanel,
  CollapsibleRoot,
  Stack,
  Text,
} from "@uiid/design-system";

import { ShellBar } from "./bar";
import {
  SIDEBAR_WIDTH,
  SIDEBAR_SPACING,
  SHELL_BORDER_WIDTH,
  SHELL_SPACING,
} from "./constants";

type SidebarContainerProps = React.PropsWithChildren<{
  /** Closed hides the sidebar completely. Defaults to open. */
  open?: boolean;
}>;

/**
 * A horizontal Collapsible does the opening and closing: its panel animates
 * between the sidebar's width and nothing. `keepMounted` holds on to the
 * scroll position and any open groups while the sidebar is closed.
 */
export const SidebarContainer = ({
  open = true,
  children,
}: SidebarContainerProps) => {
  return (
    <CollapsibleRoot data-shell-sidebar open={open} className="shrink-0">
      <CollapsiblePanel
        orientation="horizontal"
        instant={false}
        keepMounted
        grow
      >
        <Stack
          data-slot="sidebar"
          render={<aside />}
          w={SIDEBAR_WIDTH}
          br={SHELL_BORDER_WIDTH}
          grow
        >
          {children}
        </Stack>
      </CollapsiblePanel>
    </CollapsibleRoot>
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
      className="overflow-y-auto"
      gap={SHELL_SPACING}
      p={SIDEBAR_SPACING}
      grow
    >
      {children}
    </Stack>
  );
};
SidebarScrollContainer.displayName = "SidebarScrollContainer";
