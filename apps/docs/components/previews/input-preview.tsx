"use client";

import { Input } from "@uiid/forms";
import { Stack } from "@uiid/layout";

export const InputPreview = () => {
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 320 }}>
      <Input label="Name" placeholder="Enter your name" />
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Disabled" placeholder="Disabled input" disabled />
    </Stack>
  );
};
InputPreview.displayName = "InputPreview";
