"use client";

import { Card } from "@uiid/cards";

type ComponentPreviewProps = {
  title?: string;
  children: React.ReactNode;
};

export const ComponentPreview = ({ children }: ComponentPreviewProps) => {
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
};
ComponentPreview.displayName = "ComponentPreview";
