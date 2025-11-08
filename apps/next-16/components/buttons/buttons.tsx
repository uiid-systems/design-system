import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";

export function Buttons() {
  return (
    <Group gap={2}>
      <Button tooltip="Default button">Button</Button>
      <Button variant="subtle" tooltip="Subtle button">
        Button
      </Button>
      <Button variant="inverted" tooltip="Inverted button">
        Button
      </Button>
    </Group>
  );
}
