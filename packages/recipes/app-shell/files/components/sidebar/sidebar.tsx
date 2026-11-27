"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import {
  findActiveGroup,
  findActiveItem,
  type NavItem,
  toNavSections,
} from "@/lib/nav";
import { NAV } from "@/nav";

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

/** Consecutive top-level items share one list; each group stands alone. */
const SECTIONS = toNavSections(NAV);

/**
 * The sidebar, filled from the project's nav config (`@/nav`) in config order
 * and driven by the current route.
 * Compose the parts in `subcomponents/` for a sidebar with other contents.
 */
export const Sidebar = ({ title, ...props }: SidebarProps) => {
  const pathname = usePathname();
  const [groups, setGroups] = useSidebarGroups();

  const activeItem = findActiveItem(NAV, pathname);
  const activeGroup = findActiveGroup(NAV, pathname)?.label;

  const renderItem = (item: NavItem) => (
    <SidebarItem key={item.href} href={item.href} active={item === activeItem}>
      {item.label}
    </SidebarItem>
  );

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
        {SECTIONS.map((section) => {
          if (Array.isArray(section)) {
            return (
              <SidebarItems key={section[0].href}>
                {section.map(renderItem)}
              </SidebarItems>
            );
          }

          // A group's saved open state is keyed by its label.
          const id = section.label;
          const active = id === activeGroup;

          return (
            <SidebarGroup
              key={id}
              id={id}
              label={section.label}
              active={active}
              open={active ? closedAt !== pathname : groups[id] !== false}
              onOpenChange={(next) => {
                clearNoFlash();
                if (active) setClosedAt(next ? undefined : pathname);
                setGroups((saved) => ({ ...saved, [id]: next }));
              }}
            >
              {section.items.map(renderItem)}
            </SidebarGroup>
          );
        })}
      </SidebarNav>
    </SidebarRoot>
  );
};
Sidebar.displayName = "Sidebar";
