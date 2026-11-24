import type { ButtonProps } from "@uiid/buttons";
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
  /**
   * Pages shown on each side of the current page. Setting it switches to the
   * numbered layout: Previous, page numbers, Next. The first and last pages
   * are always shown, so there is no "Page X of Y" label and no First/Last.
   */
  spread?: number;
  /**
   * Renders each enabled control as a link to `page`. The element **must**
   * carry an `href`: that's what makes Button keep it a real link instead of a
   * `role="button"`. Disabled controls stay buttons and never call it, so it
   * only sees pages in range.
   *
   * @example renderLink={(page) => <Link href={`?page=${page}`} />}
   */
  renderLink?: (page: number) => React.ReactElement;
};

/** One cell of the panel: a ghost `Button` until it is the current page. */
export type PaginationButtonProps = ButtonProps & {
  /** Marks the current page, which takes the filled treatment. */
  active?: boolean;
};
