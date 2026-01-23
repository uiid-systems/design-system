import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";

export function ButtonPreview() {
  return (
    <Group gap={2}>
      <Button>Default</Button>
      <Button variant="subtle">Subtle</Button>
      <Button tone="positive">Positive</Button>
      <Button tone="negative">Negative</Button>
      <Button tone="warning">Warning</Button>
      <Button tone="info">Info</Button>
      <Button ghost>Ghost</Button>
    </Group>
  );
};