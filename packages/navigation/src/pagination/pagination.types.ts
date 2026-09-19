import type { GroupProps } from "@uiid/layout";

export type PaginationProps = Omit<GroupProps, "children"> & {
  /** Total number of pages. Values below 1 are treated as 1. */
  totalPages: number;
  /** Controlled current page, 1-indexed. Out-of-range values are clamped. */
  page?: number;
  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;
  /** Called with the target page when a control is activated. Not called for the current page. */
  onPageChange?: (page: number) => void;
};
