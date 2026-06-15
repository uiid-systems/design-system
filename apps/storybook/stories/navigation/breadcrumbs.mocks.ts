import { Home } from "@uiid/icons";
import type { BreadcrumbsItem } from "@uiid/design-system";

export const MOCK_ITEMS: BreadcrumbsItem[] = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];

export const MOCK_ITEMS_WITH_ICON: BreadcrumbsItem[] = [
  { label: "Home", value: "/", icon: Home },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];
