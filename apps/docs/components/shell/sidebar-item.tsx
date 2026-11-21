import { List, ListItem, Text } from "@uiid/design-system";
import Link from "next/link";

import { SIDEBAR_LIST_ITEM_SPACING } from "./constants";

/** A plain list of sidebar items, for links that sit outside any group. */
export const SidebarItems = ({ children }: React.PropsWithChildren) => {
  return (
    <List data-slot="sidebar-items" gap={SIDEBAR_LIST_ITEM_SPACING}>
      {children}
    </List>
  );
};
SidebarItems.displayName = "SidebarItems";

type SidebarItemProps = React.PropsWithChildren<{
  href: string;
  /** The link points at the current page. */
  active?: boolean;
}>;

/** One link in the sidebar. Render it inside a `SidebarItems` or a `SidebarGroup`. */
export const SidebarItem = ({
  href,
  active = false,
  children,
}: SidebarItemProps) => {
  return (
    <ListItem data-slot="sidebar-item">
      <Text
        render={<Link href={href} aria-current={active ? "page" : undefined} />}
        emphasis={active ? "default" : "muted"}
        weight={active ? "semibold" : "normal"}
        underline={!active}
      >
        {children}
      </Text>
    </ListItem>
  );
};
SidebarItem.displayName = "SidebarItem";
