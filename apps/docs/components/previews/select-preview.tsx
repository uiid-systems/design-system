"use client";

import { Select } from "@uiid/forms";
import { Stack } from "@uiid/layout";

export const SelectPreview = () => {
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 320 }}>
      <Select
        label="Country"
        placeholder="Select a country"
        items={[
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "ca", label: "Canada" },
          { value: "au", label: "Australia" },
        ]}
      />
    </Stack>
  );
};
SelectPreview.displayName = "SelectPreview";
