"use client";

import { SiNpm } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@uiid/buttons";
import { Home } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Breadcrumbs } from "@uiid/navigation";

import { fromSlug, urls } from "@/constants/urls";
import { NPM_URL } from "@/constants";

type BreadcrumbItem = {
  label: string;
  value: string;
  icon?: typeof Home;
};

export const DocsHeader = () => {
  const pathname = usePathname();

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
      ax="space-between"
      fullwidth
      gap={4}
      p={4}
      bb={1}
      className="sticky top-0 bg-(--shade-background) z-10"
    >
      <Breadcrumbs items={breadcrumbItems} />
      <Group gap={2} ay="center">
        <Button
          size="xsmall"
          ghost
          render={<Link href={NPM_URL} target="_blank" />}
          nativeButton={false}
        >
          <SiNpm />
          v0.0.3
        </Button>
      </Group>
    </Group>
  );
};
DocsHeader.displayName = "DocsHeader";
