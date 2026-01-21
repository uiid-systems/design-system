"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const StackPreview = () => {
  return (
    <Stack gap={2}>
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
    </Stack>
  );
};
StackPreview.displayName = "StackPreview";
