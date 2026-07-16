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
      { label: "Button", value: "/components/buttons/button" },
      { label: "Toggle Button", value: "/components/buttons/toggle-button" },
    ],
  },
];
