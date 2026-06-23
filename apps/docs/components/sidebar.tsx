import Link from "next/link";
import { List, ListItem, Stack, Text } from "@uiid/design-system";

import {
  SIDEBAR_WIDTH,
  SIDEBAR_SPACING,
  SHELL_BORDER_WIDTH,
  SIDEBAR_LIST_ITEM_SPACING,
} from "@/constants";
import { SITEMAP, type SitemapItem } from "@/sitemap";

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarScrollContainer>
        <SidebarHeader>uiid docs</SidebarHeader>
        <SidebarList items={SITEMAP} />
        <SidebarList items={SITEMAP} category="Components" />
      </SidebarScrollContainer>
    </SidebarContainer>
  );
}

const SidebarContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="sidebar"
      render={<aside />}
      maxw={SIDEBAR_WIDTH}
      br={SHELL_BORDER_WIDTH}
      ax="stretch"
      fullwidth
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
      gap={SIDEBAR_SPACING}
      p={SIDEBAR_SPACING}
    >
      {children}
    </Stack>
  );
};
SidebarScrollContainer.displayName = "SidebarScrollContainer";

const SidebarHeader = ({ children }: React.PropsWithChildren) => {
  return (
    <Text data-slot="sidebar-header" weight="bold" size={3}>
      {children}
    </Text>
  );
};
SidebarHeader.displayName = "SidebarHeader";

type SidebarListProps = {
  items: SitemapItem[];
  category?: string;
};

const SidebarList = ({ items, category }: SidebarListProps) => {
  return (
    <List
      data-slot="sidebar-list"
      gap={SIDEBAR_LIST_ITEM_SPACING}
      category={category}
    >
      {items.map((item) => (
        <ListItem key={item.value}>
          <Text render={<Link href={item.value} />}>{item.label}</Text>
        </ListItem>
      ))}
    </List>
  );
};
SidebarList.displayName = "SidebarList";
