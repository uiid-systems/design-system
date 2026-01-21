"use client";

import { Switch } from "@uiid/forms";
import { Stack } from "@uiid/layout";

export const SwitchPreview = () => {
  return (
    <Stack gap={4}>
      <Switch label="Enable notifications" />
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Disabled" disabled />
    </Stack>
  );
};
SwitchPreview.displayName = "SwitchPreview";
