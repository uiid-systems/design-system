import Link from "next/link";

import { ChevronLeft, ChevronRight } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import type { PageLink } from "@/lib/generate-nav";

type PrevNextNavProps = {
  prev: PageLink | null;
  next: PageLink | null;
};

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <Group ax="space-between" fullwidth bt={1} pt={8} mt={8}>
      {prev ? (
        <Link href={prev.href} style={{ textDecoration: "none" }}>
          <Group gap={2} ay="center">
            <ChevronLeft size={16} />
            <Stack gap={2}>
              <Text size={-1} shade="halftone">
                Previous
              </Text>
              <Text size={0} weight="bold">
                {prev.label}
              </Text>
            </Stack>
          </Group>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} style={{ textDecoration: "none" }}>
          <Group gap={2} ay="center">
            <Stack gap={2} ax="end">
              <Text size={-1} shade="halftone">
                Next
              </Text>
              <Text size={0} weight="bold">
                {next.label}
              </Text>
            </Stack>
            <ChevronRight size={16} />
          </Group>
        </Link>
      ) : (
        <span />
      )}
    </Group>
  );
}
