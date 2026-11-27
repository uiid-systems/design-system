import { Stack, Text } from "@uiid/design-system";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Steps",
};

export default function NextStepsPage() {
  return (
    <Stack data-slot="next-steps-page" gap={4} pb={8}>
      <Text render={<h1 />} size={5} weight="semibold">
        Next Steps
      </Text>
      <Text render={<p />}>
        Replace these pages with your own. nav.ts, the layout and the pages are
        yours to edit as the app grows.
      </Text>
    </Stack>
  );
}
