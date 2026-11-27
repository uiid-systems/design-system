"use client";

import { Box, Card, Group } from "@uiid/design-system";
import { ArrowLeftIcon } from "@uiid/icons/arrow-left";
import { ArrowRightIcon } from "@uiid/icons/arrow-right";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavGroup, listNavItems } from "@/lib/nav";
import { NAV } from "@/nav";

/**
 * The pages the pager steps through: every item in a group, in nav order.
 * Top-level items such as Home and Changelog are not component docs, so they
 * get no pager and are not anyone's previous or next page.
 */
const PAGES = listNavItems(NAV.filter(isNavGroup));

/** Previous/next component links in nav order, shown on doc pages. */
export const Pager = () => {
  const pathname = usePathname();
  const index = PAGES.findIndex((page) => page.href === pathname);
  if (index === -1) return null;

  const prev = PAGES[index - 1];
  const next = PAGES[index + 1];

  return (
    <Group data-slot="pager" gap={4} evenly w="full" pb={32} pt={8} bt={1}>
      {prev ? (
        <Card
          render={<Link href={prev.href} />}
          title={
            <Group render={<span />} gap={2} ay="center">
              <ArrowLeftIcon size={16} />
              {prev.label}
            </Group>
          }
        />
      ) : (
        <Box aria-hidden />
      )}
      {next ? (
        <Card
          render={<Link href={next.href} />}
          title={
            <Group render={<span />} gap={2} ax="end" ay="center" w="full">
              {next.label}
              <ArrowRightIcon size={16} />
            </Group>
          }
        />
      ) : (
        <Box aria-hidden />
      )}
    </Group>
  );
};
Pager.displayName = "Pager";
