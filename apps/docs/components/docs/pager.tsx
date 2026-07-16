"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Box, Card, Group } from "@uiid/design-system";
import { ArrowLeftIcon, ArrowRightIcon } from "@uiid/icons";

import { COMPONENTS_SITEMAP } from "@/sitemap";
import type { SitemapEntry, SitemapItem } from "@/sitemap";

type PagerEntry = SitemapItem & { category?: string };

const flatten = (entries: SitemapEntry[], category?: string): PagerEntry[] =>
  entries.flatMap((entry) =>
    "category" in entry
      ? flatten(entry.items, entry.category)
      : [{ ...entry, category }],
  );

/** Previous/next component links in sitemap order, shown on doc pages. */
export const Pager = () => {
  const pathname = usePathname();
  const pages = flatten(COMPONENTS_SITEMAP);
  const index = pages.findIndex((page) => page.value === pathname);
  if (index === -1) return null;

  const prev = pages[index - 1];
  const next = pages[index + 1];

  return (
    <Group data-slot="pager" gap={4} evenly fullwidth>
      {prev ? (
        <Card
          render={<Link href={prev.value} />}
          icon={ArrowLeftIcon}
          title={prev.label}
          description={prev.category}
        />
      ) : (
        <Box aria-hidden />
      )}
      {next ? (
        <Card
          render={<Link href={next.value} />}
          icon={ArrowRightIcon}
          title={next.label}
          description={next.category}
          /** @todo create reverse prop? */
          HeaderProps={{ className: "flex-row-reverse" }}
        />
      ) : (
        <Box aria-hidden />
      )}
    </Group>
  );
};
Pager.displayName = "Pager";
