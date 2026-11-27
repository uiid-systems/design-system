"use client";

import { Breadcrumbs as UiidBreadcrumbs } from "@uiid/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buildNavTrail } from "@/lib/nav";
import { NAV } from "@/nav";

import type { BreadcrumbsProps } from "./breadcrumbs.types";

/**
 * The breadcrumb trail for the current route, built from the project's nav
 * config (`@/nav`). Each crumb's label and link come from its nav entry.
 */
export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const pathname = usePathname();
  const items = buildNavTrail(NAV, pathname).map(({ label, href }) => ({
    label,
    value: href,
  }));

  return <UiidBreadcrumbs items={items} linkAs={Link} {...props} />;
};
Breadcrumbs.displayName = "Breadcrumbs";
