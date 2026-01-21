"use client";

import { Checkbox } from "@uiid/forms";
import { Stack } from "@uiid/layout";

export const CheckboxPreview = () => {
  return (
    <Stack gap={4}>
      <Checkbox label="Accept terms and conditions" />
      <Checkbox label="Subscribe to newsletter" defaultChecked />
      <Checkbox label="Disabled option" disabled />
    </Stack>
  );
};
CheckboxPreview.displayName = "CheckboxPreview";
