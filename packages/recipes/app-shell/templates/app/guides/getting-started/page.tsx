import { Stack, Text } from "@uiid/design-system";
import type { Metadata } from "next";

import { findActiveItem } from "@/lib/nav";
import { NAV } from "@/nav";

/** The page's name is its entry's label in nav.ts, the only place it is written. */
const label = findActiveItem(NAV, "/guides/getting-started")?.label;

/** With no entry there is no title, so the layout's default shows. */
export const metadata: Metadata = label === undefined ? {} : { title: label };

export default function GettingStartedPage() {
  return (
    <Stack data-slot="getting-started-page" gap={4} pb={8}>
      <Text render={<h1 />} size={5} weight="semibold">
        {label}
      </Text>
      <Text render={<p />}>
        A page in a group. The group is open in the sidebar, this page is marked
        current, and the breadcrumbs lead back through the group to the home
        page.
      </Text>
    </Stack>
  );
}
