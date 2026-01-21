"use client";

import { Separator, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const SeparatorPreview = () => {
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 300 }}>
      <Text>Above</Text>
      <Separator />
      <Text>Below</Text>
    </Stack>
  );
};
SeparatorPreview.displayName = "SeparatorPreview";
