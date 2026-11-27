import { describe, expect, it } from "vitest";

import {
  buildNavTrail,
  findActiveGroup,
  findActiveItem,
  listNavItems,
  type NavEntry,
  toNavSections,
} from "./nav";

const home = { label: "Home", href: "/" };
const changelog = { label: "Changelog", href: "/changelog" };
const profile = { label: "Profile", href: "/settings/profile" };
const billing = { label: "Billing", href: "/settings/billing" };
const settings = {
  label: "Settings",
  href: "/settings",
  items: [profile, billing],
};
const box = { label: "Box", href: "/layout/box" };
const stack = { label: "Stack", href: "/layout/stack" };
const layout = { label: "Layout", items: [box, stack] };

const NAV: NavEntry[] = [home, changelog, layout, settings];

/** A group whose own href is also one of its items' hrefs. */
const SHARED: NavEntry[] = [
  {
    label: "Settings",
    href: "/settings",
    items: [{ label: "Overview", href: "/settings" }, profile],
  },
];

describe("findActiveItem", () => {
  it("matches the pathname exactly", () => {
    expect(findActiveItem(NAV, "/changelog")).toBe(changelog);
    expect(findActiveItem(NAV, "/layout/box")).toBe(box);
  });

  it("matches a route below an item", () => {
    expect(findActiveItem(NAV, "/settings/profile/edit")).toBe(profile);
  });

  it("does not match a sibling that only shares a prefix", () => {
    expect(findActiveItem(NAV, "/changelogs")).toBeUndefined();
  });

  it("prefers the longest href when several match", () => {
    const nav: NavEntry[] = [
      { label: "Settings", href: "/settings" },
      { label: "Profile", href: "/settings/profile" },
    ];
    expect(findActiveItem(nav, "/settings/profile/edit")).toBe(nav[1]);
    // Config order does not decide it.
    expect(findActiveItem([...nav].reverse(), "/settings/profile/edit")).toBe(
      nav[1],
    );
  });

  it('matches "/" only on itself', () => {
    expect(findActiveItem(NAV, "/")).toBe(home);
    expect(findActiveItem(NAV, "/nowhere")).toBeUndefined();
    expect(findActiveItem(NAV, "//nowhere")).toBeUndefined();
  });

  it("never matches an href with no path", () => {
    const nav: NavEntry[] = [
      { label: "Empty", href: "" },
      { label: "Query", href: "?tab=x" },
      { label: "Hash", href: "#top" },
    ];
    expect(findActiveItem(nav, "/")).toBeUndefined();
    expect(findActiveItem(nav, "/anything")).toBeUndefined();
  });

  it("ignores one trailing slash on an entry's href", () => {
    const slashed = { label: "Settings", href: "/settings/" };
    expect(findActiveItem([slashed], "/settings")).toBe(slashed);
    expect(findActiveItem([slashed], "/settings/profile")).toBe(slashed);
  });

  it("strips a query string and hash from an entry's href", () => {
    const week = { label: "This week", href: "/reports?view=week" };
    const top = { label: "Top", href: "/docs#top" };
    const nav: NavEntry[] = [week, top];
    expect(findActiveItem(nav, "/reports")).toBe(week);
    expect(findActiveItem(nav, "/reports/2026")).toBe(week);
    expect(findActiveItem(nav, "/docs")).toBe(top);
  });

  it("ignores a query string and hash on the pathname", () => {
    expect(findActiveItem(NAV, "/changelog?page=2#v1")).toBe(changelog);
  });

  it("returns no item on a group's own href", () => {
    expect(findActiveItem(NAV, "/settings")).toBeUndefined();
    expect(findActiveItem(NAV, "/settings/other")).toBeUndefined();
  });

  it("gives the group, not its item, a path they share", () => {
    expect(findActiveItem(SHARED, "/settings")).toBeUndefined();
    expect(findActiveGroup(SHARED, "/settings")).toBe(SHARED[0]);
    expect(buildNavTrail(SHARED, "/settings")).toEqual([
      { label: "Settings", href: "/settings" },
    ]);
  });

  it("keeps the first entry in config order when two items share a path", () => {
    const top = { label: "Reports", href: "/reports" };
    const grouped = { label: "All reports", href: "/reports" };
    const group = { label: "Data", items: [grouped] };
    expect(findActiveItem([top, group], "/reports")).toBe(top);
    expect(findActiveGroup([top, group], "/reports")).toBeUndefined();
    expect(findActiveItem([group, top], "/reports")).toBe(grouped);
    expect(findActiveGroup([group, top], "/reports")).toBe(group);
  });

  it("returns undefined when nothing matches", () => {
    expect(findActiveItem(NAV, "/missing")).toBeUndefined();
    expect(findActiveItem([], "/")).toBeUndefined();
  });
});

describe("findActiveGroup", () => {
  it("returns the active item's group", () => {
    expect(findActiveGroup(NAV, "/layout/stack")).toBe(layout);
    expect(findActiveGroup(NAV, "/settings/billing")).toBe(settings);
  });

  it("returns the group on its own href and below it", () => {
    expect(findActiveGroup(NAV, "/settings")).toBe(settings);
    expect(findActiveGroup(NAV, "/settings/other")).toBe(settings);
  });

  it("returns undefined for a top-level item or no match", () => {
    expect(findActiveGroup(NAV, "/changelog")).toBeUndefined();
    expect(findActiveGroup(NAV, "/missing")).toBeUndefined();
  });
});

describe("listNavItems", () => {
  it("lists every item in config order, groups flattened", () => {
    expect(listNavItems(NAV)).toEqual([
      home,
      changelog,
      box,
      stack,
      profile,
      billing,
    ]);
  });

  it("returns an empty list for an empty config", () => {
    expect(listNavItems([])).toEqual([]);
  });
});

describe("toNavSections", () => {
  it("runs consecutive top-level items into one list, groups in place", () => {
    expect(toNavSections(NAV)).toEqual([[home, changelog], layout, settings]);
  });

  it("starts a new list after each group", () => {
    const about = { label: "About", href: "/about" };
    expect(toNavSections([layout, home, settings, about, changelog])).toEqual([
      layout,
      [home],
      settings,
      [about, changelog],
    ]);
  });

  it("returns the config's own item and group objects, not copies", () => {
    // The sidebar compares items by identity against findActiveItem's result.
    const [list, group] = toNavSections([home, layout]);
    expect(Array.isArray(list) && list[0]).toBe(home);
    expect(group).toBe(layout);
  });

  it("drops a group with no items, joining the lists either side of it", () => {
    const empty = { label: "Empty", items: [] };
    expect(toNavSections([empty])).toEqual([]);
    expect(toNavSections([home, empty, changelog])).toEqual([
      [home, changelog],
    ]);
  });

  it("returns no sections for an empty config", () => {
    expect(toNavSections([])).toEqual([]);
  });
});

describe("buildNavTrail", () => {
  it('is the "/" item alone on the home page', () => {
    expect(buildNavTrail(NAV, "/")).toEqual([home]);
  });

  it("is home then the item for a top-level item", () => {
    expect(buildNavTrail(NAV, "/changelog")).toEqual([home, changelog]);
  });

  it("has two crumbs for an item in a group with no href", () => {
    expect(buildNavTrail(NAV, "/layout/box")).toEqual([home, box]);
  });

  it("has three crumbs for an item in a group with an href", () => {
    expect(buildNavTrail(NAV, "/settings/profile")).toEqual([
      home,
      { label: "Settings", href: "/settings" },
      profile,
    ]);
  });

  it("ends with the group on its own page", () => {
    expect(buildNavTrail(NAV, "/settings")).toEqual([
      home,
      { label: "Settings", href: "/settings" },
    ]);
  });

  it("is the item's trail on a route below the item", () => {
    expect(buildNavTrail(NAV, "/settings/profile/edit")).toEqual(
      buildNavTrail(NAV, "/settings/profile"),
    );
  });

  it("ends with the group on a route below its own page", () => {
    expect(buildNavTrail(NAV, "/settings/other")).toEqual([
      home,
      { label: "Settings", href: "/settings" },
    ]);
  });

  it('is the "/" item alone when nothing matches', () => {
    expect(buildNavTrail(NAV, "/missing")).toEqual([home]);
  });

  it('has no home crumb when the config has no "/" item', () => {
    const nav: NavEntry[] = [changelog, layout];
    expect(buildNavTrail(nav, "/missing")).toEqual([]);
    expect(buildNavTrail(nav, "/layout/box")).toEqual([box]);
  });

  it('finds a "/" item inside a group', () => {
    const nav: NavEntry[] = [{ label: "Start", items: [home, changelog] }];
    expect(buildNavTrail(nav, "/changelog")).toEqual([home, changelog]);
  });

  it("keeps an entry's href, query string included, on its crumb", () => {
    const week = { label: "This week", href: "/reports?view=week" };
    expect(buildNavTrail([week], "/reports")).toEqual([week]);
  });
});
