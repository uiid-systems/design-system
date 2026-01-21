"use client";

import { useState } from "react";
import { Drawer } from "@uiid/overlays";
import { Button } from "@uiid/buttons";
import { Text } from "@uiid/typography";

export const DrawerPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Open Drawer</Button>}
      title="Drawer Title"
    >
      <Text shade="muted">
        Drawer content goes here. Drawers typically slide in from the bottom on mobile.
      </Text>
    </Drawer>
  );
};
DrawerPreview.displayName = "DrawerPreview";
