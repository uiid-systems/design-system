import { Stack, Text } from "@uiid/design-system";

import { SIDEBAR_WIDTH, SHELL_SPACING, SHELL_BORDER_WIDTH } from "@/constants";

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarScrollContainer>
        <SidebarHeader>uiid docs</SidebarHeader>
      </SidebarScrollContainer>
    </SidebarContainer>
  );
}

const SidebarContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="sidebar"
      render={<aside />}
      w={SIDEBAR_WIDTH}
      br={SHELL_BORDER_WIDTH}
      ax="stretch"
    >
      {children}
    </Stack>
  );
};
SidebarContainer.displayName = "SidebarContainer";

const SidebarScrollContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="sidebar-scroll-container"
      className="sticky top-0 overflow-y-auto h-screen"
      ax="stretch"
    >
      {children}
    </Stack>
  );
};
SidebarScrollContainer.displayName = "SidebarScrollContainer";

const SidebarHeader = ({ children }: React.PropsWithChildren) => {
  return (
    <Text data-slot="sidebar-header" weight="bold" p={SHELL_SPACING} size={3}>
      {children}
    </Text>
  );
};
SidebarHeader.displayName = "SidebarHeader";
