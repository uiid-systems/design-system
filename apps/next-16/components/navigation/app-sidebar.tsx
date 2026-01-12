"use client";

import Link from "next/link";

import { Avatar } from "@uiid/indicators";
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
import { PROFILE_PATH } from "@/constants/urls";

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
        <Avatar
          render={<Link href={PROFILE_PATH} />}
          initials="AF"
          name="Adam Fratino"
          description="Software Engineer"
        />
      </SidebarFooter>
    </Sidebar>
  );
};
AppSidebar.displayName = "AppSidebar";

const AppTitle = ({ children }: React.PropsWithChildren) => {
  const { open } = useSidebar();
  return (
    <Text
      data-slot="app-title"
      data-hide-collapsed
      size={0}
      shade="accent"
      weight="bold"
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
