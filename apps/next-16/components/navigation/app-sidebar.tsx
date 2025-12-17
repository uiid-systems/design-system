"use client";

import { Group } from "@uiid/layout";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarList,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@uiid/navigation";
import { Text } from "@uiid/typography";

import { SIDEBAR_LINKS } from "@/constants/sidebar";

export const AppSidebar = () => {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Group gap={open ? 1 : 0} ay="center" fullwidth>
          <AppTitle>UIID Design System</AppTitle>
          <SidebarTrigger />
        </Group>
      </SidebarHeader>

      <SidebarContent>
        <SidebarList items={SIDEBAR_LINKS} />
      </SidebarContent>

      <SidebarFooter>
        <Text level={0} bold>
          Sidebar footer
        </Text>
      </SidebarFooter>
    </Sidebar>
  );
};
AppSidebar.displayName = "AppSidebar";

const AppTitle = ({ children }: React.PropsWithChildren) => {
  const { open } = useSidebar();
  return (
    <Text
      data-hide-collapsed
      level={0}
      shade="accent"
      bold
      pl={open ? 2 : 0}
      style={{
        overflow: "hidden",
        alignContent: "center",
        textWrap: "nowrap",
        flex: open ? 1 : undefined,
      }}
    >
      {children}
    </Text>
  );
};
AppTitle.displayName = "AppTitle";
