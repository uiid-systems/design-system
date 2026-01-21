"use client";

import { Tooltip } from "@uiid/overlays";
import { Button } from "@uiid/buttons";

export const TooltipPreview = () => {
  return (
    <Tooltip trigger={<Button>Hover me</Button>}>
      This is a tooltip
    </Tooltip>
  );
};
TooltipPreview.displayName = "TooltipPreview";
