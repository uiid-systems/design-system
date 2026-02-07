import { Badge } from "@uiid/indicators";
import { Group } from "@uiid/layout";

export function BadgePreview() {
  return (
    <Group gap={2}>
      <Badge tone="info">New</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="positive">Completed</Badge>
      <Badge tone="critical">Critical</Badge>
      <Badge hideIndicator>Text only</Badge>
    </Group>
  );
}
