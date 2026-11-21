"use client";

import { useAtom, useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  clearNoFlash,
  SidebarContainer,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarItems,
  SidebarScrollContainer,
} from "@/components/shell";
import { sidebarGroupsAtom, sidebarOpenAtom } from "@/components/shell/store";
import {
  COMPONENTS_SITEMAP,
  type SitemapGroup,
  type SitemapItem,
} from "@/sitemap";

/** The sitemap is one level deep: categories of pages. */
const GROUPS = COMPONENTS_SITEMAP.filter(
  (entry): entry is SitemapGroup => "category" in entry,
).map((group) => ({
  id: group.category,
  items: group.items.filter(
    (entry): entry is SitemapItem => !("category" in entry),
  ),
}));

export function Sidebar() {
  const pathname = usePathname();
  const open = useAtomValue(sidebarOpenAtom);
  const [groups, setGroups] = useAtom(sidebarGroupsAtom);

  const activeGroup = GROUPS.find((group) =>
    group.items.some((item) => item.value === pathname),
  )?.id;

  // The current page's group is open on load and on navigation, whatever was
  // saved for it. That is derived rather than saved, so a group the reader
  // closed goes back to closed once they leave it. Closing the group while on
  // one of its pages holds until the next navigation.
  const [closedAt, setClosedAt] = useState<string>();

  // The no-flash style spares whichever group was active on load, so it goes
  // stale as soon as the reader navigates. A layout effect, so it is gone
  // before the new page paints.
  const loadedAt = useRef(pathname);
  useLayoutEffect(() => {
    if (pathname !== loadedAt.current) clearNoFlash();
  }, [pathname]);

  // Bring the current page's link into the scroll track's view.
  useEffect(() => {
    document
      .querySelector("[data-slot='sidebar'] [aria-current='page']")
      ?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <SidebarContainer open={open}>
      <SidebarHeader>uiid docs</SidebarHeader>
      <SidebarScrollContainer>
        <SidebarItems>
          <SidebarItem href="/" active={pathname === "/"}>
            Home
          </SidebarItem>
          <SidebarItem href="/changelog" active={pathname === "/changelog"}>
            Changelog
          </SidebarItem>
        </SidebarItems>
        {GROUPS.map((group) => (
          <SidebarGroup
            key={group.id}
            id={group.id}
            label={group.id}
            active={group.id === activeGroup}
            open={
              group.id === activeGroup
                ? closedAt !== pathname
                : (groups[group.id] ?? true)
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
      </SidebarScrollContainer>
    </SidebarContainer>
  );
}
