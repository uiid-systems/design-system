import { Stack, Text } from "@uiid/design-system";

export default function HomePage() {
  return (
    <Stack data-slot="home-page" gap={4} pb={8}>
      <Text render={<h1 />} size={5} weight="semibold">
        Home
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
