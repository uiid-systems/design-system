import Link from "next/link";
import {
  List,
  Stack,
  Text,
  Input,
  Kbd,
  type ListItemOrGroup,
} from "@uiid/design-system";
import { SearchIcon } from "@uiid/icons";

import {
  SIDEBAR_WIDTH,
  SIDEBAR_SPACING,
  SHELL_BORDER_WIDTH,
  SIDEBAR_LIST_ITEM_SPACING,
} from "./constants";

export const SidebarContainer = ({ children }: React.PropsWithChildren) => {
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

export const SidebarScrollContainer = ({
  children,
}: React.PropsWithChildren) => {
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

export const SidebarHeader = ({ children }: React.PropsWithChildren) => {
  return (
    <Text data-slot="sidebar-header" weight="bold" size={3}>
      {children}
    </Text>
  );
};
SidebarHeader.displayName = "SidebarHeader";

export type SidebarListItem = {
  label: string;
  value: string;
};

export type SidebarListGroup = {
  category: string;
  items: SidebarListEntry[];
};

export type SidebarListEntry = SidebarListItem | SidebarListGroup;

const toListItems = (entries: SidebarListEntry[]): ListItemOrGroup[] =>
  entries.map((entry) =>
    "category" in entry
      ? { category: entry.category, items: toListItems(entry.items) }
      : {
          label: (
            <Text render={<Link href={entry.value} />} shade="muted">
              {entry.label}
            </Text>
          ),
        },
  );

type SidebarListProps = {
  items: SidebarListEntry[];
  category?: string;
};

export const SidebarList = ({ items, category }: SidebarListProps) => {
  return (
    <List
      data-slot="sidebar-list"
      gap={SIDEBAR_LIST_ITEM_SPACING}
      category={category}
      items={toListItems(items)}
    />
  );
};
SidebarList.displayName = "SidebarList";

export const SidebarSearch = () => {
  return (
    <Input
      data-slot="header-search"
      placeholder="Search"
      before={<SearchIcon />}
      after={<Kbd hotkey={["meta", "k"]} />}
      size="small"
    />
  );
};
SidebarSearch.displayName = "SidebarSearch";
