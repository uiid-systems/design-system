"use client";

import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";

export const ButtonPreview = () => {
  return (
    <Group gap={4} style={{ flexWrap: "wrap" }}>
      <Button>Default</Button>
      <Button variant="subtle">Subtle</Button>
      <Button tone="positive">Positive</Button>
      <Button tone="negative">Negative</Button>
      <Button tone="warning">Warning</Button>
      <Button tone="info">Info</Button>
    </Group>
  );
};
ButtonPreview.displayName = "ButtonPreview";
