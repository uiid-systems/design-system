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
      {children ?? "/"}
    </li>
  );
};
BreadcrumbsSeparator.displayName = "BreadcrumbsSeparator";
