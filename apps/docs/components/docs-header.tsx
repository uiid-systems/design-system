"use client";

import { usePathname } from "next/navigation";

import { Home } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Breadcrumbs, SidebarTrigger, useSidebar } from "@uiid/navigation";

import { fromSlug, urls } from "@/constants/urls";

type BreadcrumbItem = {
  label: string;
  value: string;
  icon?: typeof Home;
};

export const DocsHeader = () => {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Home", value: urls.home(), icon: Home },
    ];

    const segments = pathname.split("/").filter(Boolean);

    if (segments.length >= 1) {
      const category = segments[0];
      items.push({
        label: fromSlug(category),
        value: urls.category(category),
      });
    }

    if (segments.length >= 2) {
      const category = segments[0];
      const component = segments[1];
      items.push({
        label: fromSlug(component),
        value: urls.component(category, component),
      });
    }

    return items;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <Group
      ay="center"
      gap={4}
      px={4}
      py={3}
      style={{
        borderBottom: "1px solid var(--color-halftone)",
      }}
    >
      {isMobile && <SidebarTrigger />}
      <Breadcrumbs items={breadcrumbItems} />
    </Group>
  );
};
DocsHeader.displayName = "DocsHeader";
