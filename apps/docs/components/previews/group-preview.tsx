"use client";

import { Group } from "@uiid/layout";
import { Button } from "@uiid/buttons";

export const GroupPreview = () => {
  return (
    <Group gap={4}>
      <Button>First</Button>
      <Button variant="subtle">Second</Button>
      <Button ghost>Third</Button>
    </Group>
  );
};
GroupPreview.displayName = "GroupPreview";
