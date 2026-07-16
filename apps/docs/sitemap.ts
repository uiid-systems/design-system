export type SitemapItem = {
  label: string;
  value: string;
};

export const SITEMAP: SitemapItem[] = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];

export const COMPONENTS_SITEMAP: SitemapItem[] = [
  { label: "Button", value: "/components/button" },
];
