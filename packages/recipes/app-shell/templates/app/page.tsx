import { Stack, Text } from "@uiid/design-system";

import { findActiveItem } from "@/lib/nav";
import { NAV } from "@/nav";

/**
 * The page's name is its entry's label in nav.ts, the only place it is written.
 * Home sets no title of its own, so the tab shows the layout's default.
 */
const label = findActiveItem(NAV, "/")?.label;

export default function HomePage() {
  return (
    <Stack data-slot="home-page" gap={4} pb={8}>
      <Text render={<h1 />} size={5} weight="semibold">
        {label}
      </Text>
      <Text render={<p />}>
        This app runs on the UIID app shell. The sidebar and the breadcrumbs are
        filled from nav.ts at the project root.
      </Text>
      <Text render={<p />} emphasis="muted">
        To add a page, give it an entry in nav.ts and a page.tsx at the same
        path under app/.
      </Text>
    </Stack>
  );
}
