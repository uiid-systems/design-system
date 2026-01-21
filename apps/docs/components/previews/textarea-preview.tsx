"use client";

import { Textarea } from "@uiid/forms";
import { Stack } from "@uiid/layout";

export const TextareaPreview = () => {
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 320 }}>
      <Textarea label="Message" placeholder="Type your message..." rows={4} />
    </Stack>
  );
};
TextareaPreview.displayName = "TextareaPreview";
