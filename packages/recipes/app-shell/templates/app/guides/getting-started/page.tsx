import { Stack, Text } from "@uiid/design-system";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started",
};

export default function GettingStartedPage() {
  return (
    <Stack data-slot="getting-started-page" gap={4} pb={8}>
      <Text render={<h1 />} size={5} weight="semibold">
        Getting Started
      </Text>
      <Text render={<p />}>
        A page in the Guides group. The group is open in the sidebar, this page
        is marked current, and the breadcrumbs lead back through Guides to Home.
      </Text>
    </Stack>
  );
}
