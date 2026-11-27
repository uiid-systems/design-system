import { Stack, Text } from "@uiid/design-system";
import type { Metadata } from "next";

import { findActiveGroup } from "@/lib/nav";
import { NAV } from "@/nav";

/**
 * The group's name is its label in nav.ts, the only place it is written.
 * On the group's own href, `findActiveGroup` returns the group itself.
 */
const label = findActiveGroup(NAV, "/guides")?.label;

/** With no entry there is no title, so the layout's default shows. */
export const metadata: Metadata = label === undefined ? {} : { title: label };

export default function GuidesPage() {
  return (
    <Stack data-slot="guides-page" gap={4} pb={8}>
      <Text render={<h1 />} size={5} weight="semibold">
        {label}
      </Text>
      <Text render={<p />}>
        A group with a page of its own. Its entry in nav.ts has an href, so the
        group shows in the breadcrumbs on this page and on each page in it.
      </Text>
    </Stack>
  );
}
