import { Stack, Text } from "@uiid/design-system";

export default function GuidesPage() {
  return (
    <Stack data-slot="guides-page" gap={4} pb={8}>
      <Text render={<h1 />} size={5} weight="semibold">
        Guides
      </Text>
      <Text render={<p />}>
        A group with a page of its own. Its entry in nav.ts has an href, so the
        group shows in the breadcrumbs on this page and on each page in it.
      </Text>
    </Stack>
  );
}
