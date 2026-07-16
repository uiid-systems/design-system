export type SitemapItem = {
  label: string;
  value: string;
};

export type SitemapGroup = {
  category: string;
  items: SitemapEntry[];
};

export type SitemapEntry = SitemapItem | SitemapGroup;

export const SITEMAP: SitemapItem[] = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];

export const COMPONENTS_SITEMAP: SitemapEntry[] = [
  {
    category: "Buttons",
    items: [
      { label: "Button", value: "/buttons/button" },
      { label: "Toggle Button", value: "/buttons/toggle-button" },
    ],
  },
  {
    category: "Cards",
    items: [{ label: "Card", value: "/cards/card" }],
  },
  {
    category: "Layout",
    items: [
      { label: "Box", value: "/layout/box" },
      { label: "Conditional Render", value: "/layout/conditional-render" },
      { label: "Group", value: "/layout/group" },
      { label: "Layer", value: "/layout/layer" },
      { label: "Separator", value: "/layout/separator" },
      { label: "Stack", value: "/layout/stack" },
      { label: "Switch Render", value: "/layout/switch-render" },
    ],
  },
  {
    category: "Lists",
    items: [{ label: "List", value: "/lists/list" }],
  },
  {
    category: "Typography",
    items: [
      { label: "Prose", value: "/typography/prose" },
      { label: "Text", value: "/typography/text" },
    ],
  },
];
