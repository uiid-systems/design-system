export type SitemapItem = {
  label: string;
  value: string;
};

export const SITEMAP: SitemapItem[] = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];
