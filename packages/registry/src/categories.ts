export type CategoryMeta = {
  key: string;
  label: string;
};

// Ordered array — position = display order
export const categories: CategoryMeta[] = [
  { key: "layout", label: "Layout" },
  { key: "typography", label: "Typography" },
  { key: "buttons", label: "Buttons" },
  { key: "cards", label: "Cards" },
  { key: "forms", label: "Forms" },
  { key: "indicators", label: "Indicators" },
  { key: "interactive", label: "Interactive" },
  { key: "overlays", label: "Overlays" },
  { key: "navigation", label: "Navigation" },
];

export const categoryKeys = categories.map((c) => c.key);
export type CategoryKey = (typeof categoryKeys)[number];
