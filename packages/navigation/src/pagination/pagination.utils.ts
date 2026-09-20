import type { PaginationItem } from "./pagination.types";

/**
 * Bounds `page` to `[1, totalPages]`. A `totalPages` below 1 is treated as 1,
 * so an empty result set still has a page to show.
 */
export const clampPage = (page: number, totalPages: number) =>
  Math.min(Math.max(page, 1), Math.max(1, totalPages));

/**
 * Whether a click on a link opens it somewhere other than this tab: a modifier
 * key is held, or the link has a `target` other than `_self`. The browser
 * handles that navigation, so the page shown here shouldn't change with it.
 */
export const opensElsewhere = (event: React.MouseEvent<HTMLElement>) => {
  const target = event.currentTarget.getAttribute("target");
  return (
    (!!target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
};

/**
 * The numbered window: the first and last pages, plus `spread` pages on each
 * side of the current one. A gap of two or more pages collapses to an
 * ellipsis; a gap of exactly one shows that page, since an ellipsis would take
 * the same space and hide it.
 *
 * Every page renders the same number of items — `2 * spread + 5`, the widest
 * shape, or `totalPages` when that is smaller — so the control keeps one width
 * and the controls beside it never move. Near either end the gap on that side
 * has no pages left to hide, so the window takes its slot back and reaches one
 * page further into the middle.
 *
 * @example getPaginationItems(6, 31, 1) // [1, "ellipsis", 5, 6, 7, "ellipsis", 31]
 * @example getPaginationItems(1, 31, 1) // [1, 2, 3, 4, 5, "ellipsis", 31]
 */
export const getPaginationItems = (
  page: number,
  totalPages: number,
  spread: number,
): PaginationItem[] => {
  const lastPage = Math.max(1, totalPages);
  const current = clampPage(page, lastPage);
  const reach = Math.max(0, spread);
  // First, a gap, the window, a gap, last — the shape every page is held to.
  const slots = 2 * reach + 5;

  // Too few pages for a gap to ever collapse, so the width holds on its own.
  if (lastPage <= slots)
    return Array.from({ length: lastPage }, (_, index) => index + 1);

  /*
   * The window sits between the first and last pages. Pushing it off the end
   * it overruns is what keeps the count fixed: `slots - 2` is the furthest it
   * reaches when anchored to the start, `lastPage - slots + 3` the nearest it
   * starts when anchored to the end. Only one clamp can bite at a time —
   * needing both would mean `lastPage <= slots`, which returned above.
   */
  const windowStart = Math.min(
    Math.max(current - reach, 2),
    lastPage - slots + 3,
  );
  const windowEnd = Math.max(
    Math.min(current + reach, lastPage - 1),
    slots - 2,
  );

  const pages = [1];
  for (let p = windowStart; p <= windowEnd; p++) pages.push(p);
  pages.push(lastPage);

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
