import { List } from "@uiid/design-system";

import { SIDEBAR_LIST_ITEM_SPACING } from "../sidebar.constants";
import type { SidebarItemsProps } from "../sidebar.types";

/** A plain list of sidebar items, for links that sit outside any group. */
export const SidebarItems = ({ children, ...props }: SidebarItemsProps) => {
  return (
    <List data-slot="sidebar-items" gap={SIDEBAR_LIST_ITEM_SPACING} {...props}>
      {children}
    </List>
  );
};
SidebarItems.displayName = "SidebarItems";
