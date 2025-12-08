"use client";

import { UserCircle, Home, Heart } from "@uiid/icons";
import { Group, type ListProps } from "@uiid/layout";
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

const MOCK_LINKS: ListProps["items"] = [
  {
    label: "TODO: Fix top-level item",
    value: "top-level-item",
    icon: UserCircle,
  },
  {
    category: "Community",
    collapsible: true,
    icon: Home,
    items: [
      { label: "Player directory", value: "players" },
      { label: "Join the Discord", value: "join-the-discord" },
    ],
  },
  {
    category: "Competition",
    collapsible: true,
    icon: Heart,
    items: [
      { label: "Leaderboards", value: "leaderboards" },
      { label: "Find a match", value: "find-a-match" },
      { label: "Create a match", value: "create-a-match" },
      { label: "Recent matches", value: "recent-matches" },
    ],
  },
];

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
        <SidebarList items={MOCK_LINKS} />
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
