import type { GroupProps } from "@uiid/layout";

/** One slot in the numbered window: a page number or a collapsed gap. */
export type PaginationItem = number | "ellipsis";

export type PaginationProps = Omit<GroupProps, "children"> & {
  /** Total number of pages. Values below 1 are treated as 1. */
  totalPages: number;
  /** Controlled current page, 1-indexed. Out-of-range values are clamped. */
  page?: number;
  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;
  /** Called with the target page when a control is activated. Not called for the current page. */
  onPageChange?: (page: number) => void;
  /**
   * Pages shown on each side of the current page. Setting it switches to the
   * numbered layout: Previous, page numbers, Next. The first and last pages
   * are always shown, so there is no "Page X of Y" label and no First/Last.
   */
  spread?: number;
};
