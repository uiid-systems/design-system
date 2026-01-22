"use client";

import { Input } from "@uiid/forms";

export const InputPreview = () => {
  return (
    <Input
      type="email"
      label="Email"
      description="We'll never share your email with anyone."
      placeholder="you@example.com"
      required
    />
  );
};
InputPreview.displayName = "InputPreview";
