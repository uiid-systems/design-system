import { Box } from "@uiid/layout";

import type { BreadcrumbsProps } from "../breadcrumbs.types";

export type BreadcrumbsContainerProps = Omit<BreadcrumbsProps, "items">;

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
