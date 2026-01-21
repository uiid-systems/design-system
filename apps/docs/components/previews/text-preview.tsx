"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const TextPreview = () => {
  return (
    <Stack gap={2}>
      <Text size={6} weight="bold">
        Heading
      </Text>
      <Text size={2}>Body text with normal styling.</Text>
      <Text shade="muted">Muted text for secondary content.</Text>
      <Text tone="positive">Positive tone for success messages.</Text>
      <Text tone="negative">Negative tone for errors.</Text>
    </Stack>
  );
};
TextPreview.displayName = "TextPreview";
