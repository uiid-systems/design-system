export type CategoryMeta = {
  key: string;
  label: string;
  description?: string;
};

// Ordered array — position = display order
export const categories: CategoryMeta[] = [
  {
    key: "layout",
    label: "Layout",
    description:
      "Primitives for spacing, alignment, and page structure. Stack, Group, Box, and more.",
  },
  {
    key: "typography",
    label: "Typography",
    description:
      "Text rendering with size, weight, shade, and semantic markup support.",
  },
  {
    key: "buttons",
    label: "Buttons",
    description:
      "Clickable actions with variants, sizes, and icon support.",
  },
  {
    key: "cards",
    label: "Cards",
    description:
      "Contained surfaces for grouping related content with titles, descriptions, and actions.",
  },
  {
    key: "forms",
    label: "Forms",
    description:
      "Input controls for collecting user data — text fields, selects, checkboxes, and more.",
  },
  {
    key: "indicators",
    label: "Indicators",
    description:
      "Visual cues for status, counts, and metadata — badges, alerts, and status dots.",
  },
  {
    key: "interactive",
    label: "Interactive",
    description:
      "Stateful UI patterns like accordions, tabs, toggles, and tooltips.",
  },
  {
    key: "overlays",
    label: "Overlays",
    description:
      "Layered surfaces that appear above the page — modals, drawers, sheets, and popovers.",
  },
  {
    key: "navigation",
    label: "Navigation",
    description:
      "Wayfinding components like breadcrumbs and navigation links.",
  },
];

export const categoryKeys = categories.map((c) => c.key);
export type CategoryKey = (typeof categoryKeys)[number];
