"use client";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";

type ComponentPreviewProps = {
  title?: string;
  children: React.ReactNode;
};

export const ComponentPreview = ({
  title = "Preview",
  children,
}: ComponentPreviewProps) => {
  return (
    <Card title={title}>
      <Stack
        gap={4}
        p={4}
        ax="center"
        ay="center"
        style={{
          minHeight: 120,
          background: "var(--color-surface)",
          borderRadius: "var(--radius-medium)",
        }}
      >
        {children}
      </Stack>
    </Card>
  );
};
ComponentPreview.displayName = "ComponentPreview";
