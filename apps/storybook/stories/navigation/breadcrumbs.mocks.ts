import type { BreadcrumbsItemData } from "@uiid/design-system";
import { HomeIcon } from "@uiid/icons/house";

export const MOCK_ITEMS: BreadcrumbsItemData[] = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];

export const MOCK_ITEMS_WITH_ICON: BreadcrumbsItemData[] = [
  { label: "Home", value: "/", icon: HomeIcon },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];
