"use client";

import { Card } from "@uiid/cards";

interface ComponentDetailsPreviewProps {
  title?: string;
  children: React.ReactNode;
}

export function ComponentDetailsPreview({
  children,
}: ComponentDetailsPreviewProps) {
  return (
    <Card title="Preview" fullwidth mt={12}>
      <Card
        data-slot="component-details-preview"
        gap={4}
        ax="stretch"
        ay="center"
        fullwidth
        className="bg-(--shade-background) min-h-64"
      >
        {children}
      </Card>
    </Card>
  );
}
ComponentDetailsPreview.displayName = "ComponentDetailsPreview";
