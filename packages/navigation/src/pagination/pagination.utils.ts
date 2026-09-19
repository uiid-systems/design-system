/**
 * Bounds `page` to `[1, totalPages]`. A `totalPages` below 1 is treated as 1,
 * so an empty result set still has a page to show.
 */
export const clampPage = (page: number, totalPages: number) =>
  Math.min(Math.max(page, 1), Math.max(1, totalPages));
