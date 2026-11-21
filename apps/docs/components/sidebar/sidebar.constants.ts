import {
  COMPONENTS_SITEMAP,
  type SitemapGroup,
  type SitemapItem,
} from "@/sitemap";

/** The sidebar's element id, for the toggle's `aria-controls`. */
export const SIDEBAR_ID = "sidebar";
/** Set to `"closed"` on `<html>` while the sidebar is closed. CSS reads it. */
export const SIDEBAR_ATTRIBUTE = "data-sidebar";
/** The localStorage key the sidebar's open state is saved under. */
export const SIDEBAR_STORAGE_KEY = "uiid-sidebar-open";
/** The localStorage key the sidebar groups' open state is saved under. */
export const SIDEBAR_GROUPS_STORAGE_KEY = "uiid-sidebar-groups";

export const SIDEBAR_BORDER_WIDTH = 1;
export const SIDEBAR_SPACING = 6;
/** The space between the sidebar's lists and groups. */
export const SIDEBAR_GAP = 3;
export const SIDEBAR_LIST_ITEM_SPACING = 1;
/** How far a group's items sit in from its label, in spacing units. */
export const SIDEBAR_GROUP_INDENT = 2;

/** The sidebar's groups. The sitemap is one level deep: categories of pages. */
export const SIDEBAR_GROUPS = COMPONENTS_SITEMAP.filter(
  (entry): entry is SitemapGroup => "category" in entry,
).map((group) => ({
  id: group.category,
  items: group.items.filter(
    (entry): entry is SitemapItem => !("category" in entry),
  ),
}));
