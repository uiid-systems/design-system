"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Breadcrumbs } from "@uiid/design-system";

const toLabel = (segment: string) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** Breadcrumb trail derived from the current route. */
export function HeaderBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items = [
    { label: "Home", value: "/" },
    ...segments.map((segment, i) => ({
      label: toLabel(segment),
      value: `/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];

  return (
    <Breadcrumbs data-slot="header-breadcrumbs" items={items} linkAs={Link} />
  );
}
