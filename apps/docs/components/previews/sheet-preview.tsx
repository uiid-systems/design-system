"use client";

import { useState } from "react";
import { Sheet } from "@uiid/overlays";
import { Button } from "@uiid/buttons";
import { Text } from "@uiid/typography";

export const SheetPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Open Sheet</Button>}
      title="Sheet Title"
      description="Sheet content slides in from the side."
    >
      <Text shade="muted">
        Great for navigation, forms, or additional content.
      </Text>
    </Sheet>
  );
};
SheetPreview.displayName = "SheetPreview";
