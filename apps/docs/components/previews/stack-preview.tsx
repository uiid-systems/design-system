import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";

export function StackPreview() {
  return (
    <Stack gap={2}>
      <Card title="First" />
      <Card title="Second" />
      <Card title="Third" />
    </Stack>
  );
}
