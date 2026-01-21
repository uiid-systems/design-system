"use client";

import { Layer, Box } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const LayerPreview = () => {
  return (
    <Layer style={{ width: 200, height: 100 }}>
      <Box
        p={4}
        style={{
          background: "var(--color-accent)",
          width: "100%",
          height: "100%",
        }}
      >
        <Text>Base Layer</Text>
      </Box>
      <Box
        p={2}
        style={{
          background: "var(--color-surface)",
          position: "absolute",
          bottom: 8,
          right: 8,
          borderRadius: "var(--radius-small)",
        }}
      >
        <Text size={-1}>Overlay</Text>
      </Box>
    </Layer>
  );
};
LayerPreview.displayName = "LayerPreview";
