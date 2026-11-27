/**
 * Types for the project's nav config (`@/nav`) and the pure helpers the
 * sidebar, breadcrumbs and pager read it through. This file imports nothing,
 * so it stays unit-testable and copies into any project unchanged.
 */

/** One page. */
export type NavItem = {
  label: string;
  /**
   * A path from the root, such as `/layout/box`. A query string, hash or one
   * trailing slash is ignored when matching; an href with no path never matches.
   */
  href: string;
};

/**
 * A labelled set of pages. Groups hold items only, so the config is one level deep.
 * A group's `label` is its saved open state's id, so labels are unique among groups.
 */
export type NavGroup = {
  label: string;
  /** The group's own page, when it has one. It gives the group a breadcrumb. */
  href?: string;
  items: NavItem[];
};

export type NavEntry = NavItem | NavGroup;

/** A breadcrumb: the label and link of the nav entry it comes from. */
export type NavCrumb = {
  label: string;
  href: string;
};

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

/** Every item in config order, with each group's items in place of the group. */
export function listNavItems(entries: NavEntry[]): NavItem[] {
  return entries.flatMap((entry) =>
    isNavGroup(entry) ? entry.items : [entry],
  );
}

/** A run of consecutive top-level items, or one group. */
export type NavSection = NavItem[] | NavGroup;

/**
 * The config as the sidebar lays it out, in order: each run of consecutive
 * top-level items as one list, and each group on its own.
 */
export function toNavSections(entries: NavEntry[]): NavSection[] {
  const sections: NavSection[] = [];

  for (const entry of entries) {
    if (isNavGroup(entry)) {
      sections.push(entry);
      continue;
    }
    const last = sections.at(-1);
    if (Array.isArray(last)) last.push(entry);
    else sections.push([entry]);
  }

  return sections;
}

/** The path part of an href or URL, without its query string, hash or one trailing slash. */
function toPath(href: string): string {
  const end = href.search(/[?#]/);
  const path = end === -1 ? href : href.slice(0, end);
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** The length of `href`'s path when it matches `pathname`, or -1 when it does not. */
function matchLength(href: string, pathname: string): number {
  const path = toPath(href);
  if (!path.startsWith("/")) return -1;
  if (pathname === path) return path.length;
  if (path !== "/" && pathname.startsWith(`${path}/`)) return path.length;
  return -1;
}

type ActiveMatch = { item?: NavItem; group?: NavGroup };

/**
 * The entry whose href best matches `pathname`: an equal path, or a path below
 * it. The longest href wins; on a tie the first in config order wins, and a
 * group comes before its items, so on a group's own href no item is active.
 */
function findActive(entries: NavEntry[], pathname: string): ActiveMatch {
  const path = toPath(pathname);
  let best: ActiveMatch = {};
  let bestLength = -1;

  const consider = (href: string, match: ActiveMatch) => {
    const length = matchLength(href, path);
    if (length > bestLength) {
      best = match;
      bestLength = length;
    }
  };

  for (const entry of entries) {
    if (!isNavGroup(entry)) {
      consider(entry.href, { item: entry });
      continue;
    }
    if (entry.href !== undefined) consider(entry.href, { group: entry });
    for (const item of entry.items) {
      consider(item.href, { item, group: entry });
    }
  }

  return best;
}

/** The item for `pathname`, or undefined on a group's own page or when nothing matches. */
export function findActiveItem(
  entries: NavEntry[],
  pathname: string,
): NavItem | undefined {
  return findActive(entries, pathname).item;
}

/** The active item's group, or the group whose own page `pathname` is. */
export function findActiveGroup(
  entries: NavEntry[],
  pathname: string,
): NavGroup | undefined {
  return findActive(entries, pathname).group;
}

/**
 * The breadcrumb trail for `pathname`, in order: the `"/"` item when the config
 * has one and it is not the current page, the active group when it has an href,
 * then the active item. On a group's own page the group is the last crumb.
 */
export function buildNavTrail(
  entries: NavEntry[],
  pathname: string,
): NavCrumb[] {
  const { item, group } = findActive(entries, pathname);
  const home = listNavItems(entries).find(
    (entry) => toPath(entry.href) === "/",
  );
  const trail: NavCrumb[] = [];

  if (home && home !== item) {
    trail.push({ label: home.label, href: home.href });
  }
  if (group?.href !== undefined) {
    trail.push({ label: group.label, href: group.href });
  }
  if (item) {
    trail.push({ label: item.label, href: item.href });
  }

  return trail;
}
