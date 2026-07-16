import type { Metadata } from "next";
import { Stack } from "@uiid/design-system";

import { Markdown } from "@/components/docs";

export const metadata: Metadata = {
  title: "Changelog",
};

export default function ChangelogPage() {
  return (
    <Stack data-slot="changelog-page" pb={32} ax="stretch" fullwidth>
      <Markdown file="CHANGELOG.md" />
    </Stack>
  );
}
