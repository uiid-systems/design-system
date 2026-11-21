"use client";

import { List, ListItem, Text } from "@uiid/design-system";
import Link from "next/link";

import { SIDEBAR_LIST_ITEM_SPACING } from "./constants";

import styles from "./shell.module.css";

/** A plain list of sidebar items, for links that sit outside any group. */
export const SidebarItems = ({ children }: React.PropsWithChildren) => {
  return (
    <List data-slot="sidebar-items" gap={SIDEBAR_LIST_ITEM_SPACING}>
      {children}
    </List>
  );
};
SidebarItems.displayName = "SidebarItems";

/**
 * Brings the current page's link into the sidebar's scroll track. As a ref it
 * runs when the link mounts or becomes current, so a link inside a group that
 * has only just opened is still caught. It waits a frame because a Collapsible
 * panel spends its first frame at zero height, with its content out of place.
 */
const scrollIntoView = (link: HTMLAnchorElement | null) => {
  requestAnimationFrame(() => link?.scrollIntoView({ block: "nearest" }));
};

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
        render={
          <Link
            href={href}
            aria-current={active ? "page" : undefined}
            ref={active ? scrollIntoView : undefined}
          />
        }
        emphasis={active ? "default" : "muted"}
        weight={active ? "semibold" : "normal"}
        className={styles.link}
      >
        {children}
      </Text>
    </ListItem>
  );
};
SidebarItem.displayName = "SidebarItem";
