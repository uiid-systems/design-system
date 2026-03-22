import { Card } from "@uiid/cards";
import { Check, Info, Ban } from "@uiid/icons";
import { Group } from "@uiid/layout";

export function GroupPreview() {
  return (
    <Group gap={2}>
      <Card title="First" icon={Ban} />
      <Card title="Second" icon={Info} />
      <Card title="Third" icon={Check} />
    </Group>
  );
}
