"use client";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const ToasterPreview = () => {
  // Static preview - actual toast requires ToastProvider context
  return (
    <Stack gap={2}>
      <Text size={-1} shade="muted">
        Toast notifications appear from the Toaster component.
      </Text>
      <Card style={{ maxWidth: 280 }}>
        <Text size={-1}>This is a notification.</Text>
      </Card>
    </Stack>
  );
};
ToasterPreview.displayName = "ToasterPreview";
