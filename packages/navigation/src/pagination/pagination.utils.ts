import type { PaginationItem } from "./pagination.types";

/**
 * Bounds `page` to `[1, totalPages]`. A `totalPages` below 1 is treated as 1,
 * so an empty result set still has a page to show.
 */
export const clampPage = (page: number, totalPages: number) =>
  Math.min(Math.max(page, 1), Math.max(1, totalPages));

/**
 * The numbered window: the first and last pages, plus `spread` pages on each
 * side of the current one. A gap of two or more pages collapses to an
 * ellipsis; a gap of exactly one shows that page, since an ellipsis would take
 * the same space and hide it.
 *
 * @example getPaginationItems(6, 31, 1) // [1, "ellipsis", 5, 6, 7, "ellipsis", 31]
 */
export const getPaginationItems = (
  page: number,
  totalPages: number,
  spread: number,
): PaginationItem[] => {
  const lastPage = Math.max(1, totalPages);
  const current = clampPage(page, lastPage);
  const reach = Math.max(0, spread);
  const windowEnd = Math.min(lastPage, current + reach);

  const pages = [1];
  for (let p = Math.max(2, current - reach); p <= windowEnd; p++) pages.push(p);
  if (lastPage > windowEnd) pages.push(lastPage);

  const items: PaginationItem[] = [];
  let previous = 0;
  for (const p of pages) {
    if (p - previous === 2) items.push(previous + 1);
    else if (p - previous > 2) items.push("ellipsis");
    items.push(p);
    previous = p;
  }
  return items;
};
