import { Box } from "@uiid/layout";

import type { BreadcrumbsContainerProps } from "../breadcrumbs.types";

export const BreadcrumbsContainer = ({
  children,
  ...props
}: BreadcrumbsContainerProps) => {
  return (
    <Box
      render={<nav />}
      aria-label="breadcrumbs"
      data-slot="breadcrumbs"
      {...props}
    >
      {children}
    </Box>
  );
};
BreadcrumbsContainer.displayName = "BreadcrumbsContainer";
