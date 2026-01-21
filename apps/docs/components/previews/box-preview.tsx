"use client";

import { Box } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const BoxPreview = () => {
  return (
    <Box
      p={4}
      style={{
        background: "var(--color-surface)",
        border: "1px dashed var(--color-halftone)",
        borderRadius: "var(--radius-medium)",
      }}
    >
      <Text>Box with padding</Text>
    </Box>
  );
};
BoxPreview.displayName = "BoxPreview";
