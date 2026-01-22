"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const TextPreview = () => {
  return (
    <Stack gap={4}>
      <Text size={6} weight="bold" mb={4}>
        Heading
      </Text>
      <Text size={1}>Body text with normal styling.</Text>
      <Text shade="muted">Muted text for secondary content.</Text>
      <Text tone="positive">Positive tone for success messages.</Text>
      <Text tone="negative">Negative tone for errors.</Text>
      <Text size={-1} tone="warning">Small text with warning tone.</Text>
    </Stack>
  );
};
TextPreview.displayName = "TextPreview";
