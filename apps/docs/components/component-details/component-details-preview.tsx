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
    <Card>
      <Card
        gap={4}
        py={12}
        px={8}
        ax="center"
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
