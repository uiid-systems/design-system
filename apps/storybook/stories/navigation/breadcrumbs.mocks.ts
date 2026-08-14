import type { BreadcrumbsItem } from "@uiid/design-system";
import { HomeIcon } from "@uiid/icons/house";

export const MOCK_ITEMS: BreadcrumbsItem[] = [
  { label: "HomeIcon", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];

export const MOCK_ITEMS_WITH_ICON: BreadcrumbsItem[] = [
  { label: "HomeIcon", value: "/", icon: HomeIcon },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];
