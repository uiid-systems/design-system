import type { BreadcrumbsItemData } from "@uiid/design-system";

/** `toggle-group` reads as `Toggle Group`. */
const toLabel = (segment: string) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** One crumb for Home, then one per segment of the path. */
export const toBreadcrumbItems = (pathname: string): BreadcrumbsItemData[] => {
  const segments = pathname.split("/").filter(Boolean);

  return [
    { label: "Home", value: "/" },
    ...segments.map((segment, i) => ({
      label: toLabel(segment),
      value: `/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];
};
