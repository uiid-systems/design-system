import type { BreadcrumbsProps as UiidBreadcrumbsProps } from "@uiid/design-system";

/** The UIID Breadcrumbs' props, less the two this component fills in itself. */
export type BreadcrumbsProps = Omit<UiidBreadcrumbsProps, "items" | "linkAs">;
