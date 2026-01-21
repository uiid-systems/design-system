"use client";

import { Popover } from "@uiid/overlays";
import { Button } from "@uiid/buttons";
import { Text } from "@uiid/typography";

export const PopoverPreview = () => {
  return (
    <Popover
      trigger={<Button>Open Popover</Button>}
      title="Popover Title"
      description="This is popover content."
    >
      <Text shade="muted" size={-1}>
        Use popovers for contextual information and actions.
      </Text>
    </Popover>
  );
};
PopoverPreview.displayName = "PopoverPreview";
