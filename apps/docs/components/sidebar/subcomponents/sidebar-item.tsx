"use client";

import { ListItem, Text } from "@uiid/design-system";
import Link from "next/link";

import type { SidebarItemProps } from "../sidebar.types";

import styles from "../sidebar.module.css";

/**
 * Brings the current page's link into the sidebar's scroll track. As a ref it
 * runs when the link mounts or becomes current, so a link inside a group that
 * has only just opened is still caught. It waits a frame because a Collapsible
 * panel spends its first frame at zero height, with its content out of place.
 */
const scrollIntoView = (link: HTMLAnchorElement | null) => {
  requestAnimationFrame(() => link?.scrollIntoView({ block: "nearest" }));
};

/** One link in the sidebar. Render it inside a `SidebarItems` or a `SidebarGroup`. */
export const SidebarItem = ({
  href,
  active = false,
  children,
  ...props
}: SidebarItemProps) => {
  return (
    <ListItem data-slot="sidebar-item" {...props}>
      <Text
        render={
          <Link
            href={href}
            aria-current={active ? "page" : undefined}
            ref={active ? scrollIntoView : undefined}
          />
        }
        className={styles["sidebar-link"]}
        emphasis={active ? "default" : "muted"}
        weight={active ? "semibold" : "normal"}
      >
        {children}
      </Text>
    </ListItem>
  );
};
SidebarItem.displayName = "SidebarItem";
