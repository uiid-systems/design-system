"use client";

import { Breadcrumbs as UiidBreadcrumbs } from "@uiid/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { BreadcrumbsProps } from "./breadcrumbs.types";
import { toBreadcrumbItems } from "./breadcrumbs.utils";

/** The breadcrumb trail for the current route. */
export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const pathname = usePathname();

  return (
    <UiidBreadcrumbs
      items={toBreadcrumbItems(pathname)}
      linkAs={Link}
      {...props}
    />
  );
};
Breadcrumbs.displayName = "Breadcrumbs";
