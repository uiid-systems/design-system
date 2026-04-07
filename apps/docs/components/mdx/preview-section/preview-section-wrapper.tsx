import { Card } from "@uiid/cards";

import type { PreviewSectionWrapperProps } from "./preview-section.types";

export const PreviewSectionWrapper = ({
  children,
  ...props
}: PreviewSectionWrapperProps) => {
  return (
    <Card
      data-slot="preview-container"
      ax="center"
      ay="center"
      gap={4}
      py={10}
      px={6}
      my={4}
      fullwidth
      {...props}
    >
      {children}
    </Card>
  );
};
PreviewSectionWrapper.displayName = "PreviewSectionWrapper";
