import { Stack } from "@uiid/design-system";

import { Markdown } from "@/components/docs";

export default function HomePage() {
  return (
    <Stack data-slot="home-page" pb={32} ax="stretch" fullwidth>
      <Markdown file="README.md" />
    </Stack>
  );
}
