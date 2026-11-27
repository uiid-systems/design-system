import { Stack, Text } from "@uiid/design-system";
import type { Metadata } from "next";

import { findActiveItem } from "@/lib/nav";
import { NAV } from "@/nav";

/** The page's name is its entry's label in nav.ts, the only place it is written. */
const label = findActiveItem(NAV, "/guides/next-steps")?.label;

/** With no entry there is no title, so the layout's default shows. */
export const metadata: Metadata = label === undefined ? {} : { title: label };

export default function NextStepsPage() {
  return (
    <Stack data-slot="next-steps-page" gap={4} pb={8}>
      <Text render={<h1 />} size={5} weight="semibold">
        {label}
      </Text>
      <Text render={<p />}>
        Replace these pages with your own. nav.ts, the layout and the pages are
        yours to edit as the app grows.
      </Text>
    </Stack>
  );
}
