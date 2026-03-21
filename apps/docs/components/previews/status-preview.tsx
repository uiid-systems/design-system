import { Status } from "@uiid/indicators";
import { Stack } from "@uiid/layout";

export function StatusPreview() {
  return (
    <Stack gap={3}>
      <Status pulse>
        Online
      </Status>
      <Status>Away</Status>
      <Status>Do not disturb</Status>
      <Status>Offline</Status>
    </Stack>
  );
}
