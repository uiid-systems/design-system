import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";

export function StackPreview() {
  return (
    <Stack gap={2}>
      <Card tone="critical" title="Negative" />
      <Card tone="warning" title="Warning" />
      <Card tone="positive" title="Positive" />
    </Stack>
  );
}
