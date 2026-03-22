import { Badge } from "@uiid/indicators";
import { Group } from "@uiid/layout";

export function BadgePreview() {
  return (
    <Group gap={2}>
      <Badge>New</Badge>
      <Badge>Pending</Badge>
      <Badge>Completed</Badge>
      <Badge>Critical</Badge>
      <Badge hideIndicator>Text only</Badge>
    </Group>
  );
}
