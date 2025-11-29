import { ChevronRight } from "@uiid/icons";

export const BreadcrumbsSeparator = ({
  children,
  ...props
}: React.ComponentProps<"li">) => {
  return (
    <li
      data-slot="breadcrumbs-separator"
      role="presentation"
      aria-hidden="true"
      {...props}
    >
      {children ?? <ChevronRight size={16} />}
    </li>
  );
};
BreadcrumbsSeparator.displayName = "BreadcrumbsSeparator";
