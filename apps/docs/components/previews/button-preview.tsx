import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";

export function ButtonPreview() {
  return (
    <Group gap={2}>
      <Button>Default</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="ghost">Ghost</Button>
    </Group>
  );
}
