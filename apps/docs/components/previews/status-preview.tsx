import { Status } from "@uiid/indicators";
import { Stack } from "@uiid/layout";

export function StatusPreview() {
  return (
    <Stack gap={3}>
      <Status tone="positive" pulse>
        Online
      </Status>
      <Status tone="warning">Away</Status>
      <Status tone="critical">Do not disturb</Status>
      <Status>Offline</Status>
    </Stack>
  );
}
