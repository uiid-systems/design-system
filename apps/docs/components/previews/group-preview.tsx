import { Card } from "@uiid/cards";
import { Check, Info, Ban } from "@uiid/icons";
import { Group } from "@uiid/layout";

export function GroupPreview() {
  return (
    <Group gap={2}>
      <Card tone="critical" title="Negative" icon={Ban} />
      <Card tone="warning" title="Warning" icon={Info} />
      <Card tone="positive" title="Positive" icon={Check} />
    </Group>
  );
}
