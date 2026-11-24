import type { BreadcrumbsSeparatorProps } from "../breadcrumbs.types";

export const BreadcrumbsSeparator = ({
  children,
  ...props
}: BreadcrumbsSeparatorProps) => {
  return (
    <li
      data-slot="breadcrumbs-separator"
      role="presentation"
      aria-hidden="true"
      {...props}
    >
      {children ?? "/"}
    </li>
  );
};
BreadcrumbsSeparator.displayName = "BreadcrumbsSeparator";
