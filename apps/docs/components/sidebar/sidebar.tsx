"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import { SIDEBAR_GROUPS } from "./sidebar.constants";
import { useSidebarGroups } from "./sidebar.hooks";
import type { SidebarProps } from "./sidebar.types";
import { clearNoFlash } from "./sidebar.utils";
import {
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarItems,
  SidebarNav,
  SidebarRoot,
} from "./subcomponents";

/**
 * The docs sidebar, filled from the sitemap and driven by the current route.
 * Compose the parts in `subcomponents/` for a sidebar with other contents.
 */
export const Sidebar = ({ title, ...props }: SidebarProps) => {
  const pathname = usePathname();
  const [groups, setGroups] = useSidebarGroups();

  const activeGroup = SIDEBAR_GROUPS.find((group) =>
    group.items.some((item) => item.value === pathname),
  )?.id;

  // The current page's group is open on load and on navigation, whatever was
  // saved for it. That is derived rather than saved, so a group the reader
  // closed goes back to closed once they leave it. Closing the group while on
  // one of its pages holds until the next navigation.
  const [closedAt, setClosedAt] = useState<string>();

  // The no-flash style spares whichever group was active on load, so it goes
  // stale as soon as the reader navigates. A layout effect, so it is gone
  // before the new page paints. Navigating also ends a close made by hand,
  // so coming back to this page later finds its group open again.
  const loadedAt = useRef(pathname);
  useLayoutEffect(() => {
    if (pathname !== loadedAt.current) clearNoFlash();
    setClosedAt(undefined);
  }, [pathname]);

  return (
    <SidebarRoot {...props}>
      <SidebarHeader>{title}</SidebarHeader>
      <SidebarNav>
        <SidebarItems>
          <SidebarItem href="/" active={pathname === "/"}>
            Home
          </SidebarItem>
          <SidebarItem href="/changelog" active={pathname === "/changelog"}>
            Changelog
          </SidebarItem>
        </SidebarItems>
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarGroup
            key={group.id}
            id={group.id}
            label={group.id}
            active={group.id === activeGroup}
            open={
              group.id === activeGroup
                ? closedAt !== pathname
                : groups[group.id] !== false
            }
            onOpenChange={(next) => {
              clearNoFlash();
              if (group.id === activeGroup) {
                setClosedAt(next ? undefined : pathname);
              }
              setGroups((saved) => ({ ...saved, [group.id]: next }));
            }}
          >
            {group.items.map((item) => (
              <SidebarItem
                key={item.value}
                href={item.value}
                active={item.value === pathname}
              >
                {item.label}
              </SidebarItem>
            ))}
          </SidebarGroup>
        ))}
      </SidebarNav>
    </SidebarRoot>
  );
};
Sidebar.displayName = "Sidebar";
