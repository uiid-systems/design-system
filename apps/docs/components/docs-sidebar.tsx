"use client";

import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarList,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@uiid/navigation";

import { generateDocsNav, getComponentCount } from "@/lib/generate-nav";

const AppTitle = ({ children }: React.PropsWithChildren) => {
  const { open } = useSidebar();
  return (
    <Text
      data-hide-collapsed
      size={0}
      shade="muted"
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

export const DocsSidebar = () => {
  const { open } = useSidebar();
  const navItems = generateDocsNav();
  const componentCount = getComponentCount();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Group gap={open ? 1 : 0} ay="center" fullwidth>
          <a href="/" style={{ textDecoration: "none", flex: open ? 1 : undefined }}>
            <AppTitle>UIID Docs</AppTitle>
          </a>
          <SidebarTrigger />
        </Group>
      </SidebarHeader>
      <SidebarContent>
        <SidebarList items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        {open && (
          <Text size={-1} shade="muted">
            {componentCount} components
          </Text>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
DocsSidebar.displayName = "DocsSidebar";
