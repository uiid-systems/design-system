import { Alert } from "@uiid/indicators";
import { Stack } from "@uiid/layout";

export function AlertPreview() {
  return (
    <Stack gap={3} fullwidth>
      <Alert
        tone="positive"
        title="Success"
        description="Your changes have been saved successfully."
      />
      <Alert
        tone="warning"
        title="Warning"
        description="Your session will expire in 5 minutes."
      />
      <Alert
        tone="critical"
        title="Error"
        description="Failed to save changes. Please try again."
      />
      <Alert
        tone="info"
        title="Information"
        description="A new version is available."
      />
    </Stack>
  );
}
