import { describe, expect, it } from "vitest";

import { buildNavTrail, isNavGroup, listNavItems } from "./lib/nav";
import { NAV } from "./nav";

/** Rules the docs app's own nav config must keep. */
describe("NAV", () => {
  it("has unique group labels, which are the groups' saved-state ids", () => {
    const labels = NAV.filter(isNavGroup).map((group) => group.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("has unique item hrefs", () => {
    const hrefs = listNavItems(NAV).map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("starts every href with a slash", () => {
    const hrefs = [
      ...listNavItems(NAV).map((item) => item.href),
      ...NAV.filter(isNavGroup).flatMap((group) => group.href ?? []),
    ];
    for (const href of hrefs) expect(href).toMatch(/^\//);
  });

  it("gives a component page a trail of Home and the page", () => {
    const labels = buildNavTrail(NAV, "/layout/box").map(
      (crumb) => crumb.label,
    );
    expect(labels).toEqual(["Home", "Box"]);
  });

  it("links every crumb to an href in the config", () => {
    const hrefs = new Set([
      ...listNavItems(NAV).map((item) => item.href),
      ...NAV.filter(isNavGroup).flatMap((group) => group.href ?? []),
    ]);
    const pathnames = [...hrefs, "/layout", "/layout/box/extra", "/missing"];

    for (const pathname of pathnames) {
      for (const crumb of buildNavTrail(NAV, pathname)) {
        expect(hrefs).toContain(crumb.href);
      }
    }
  });
});
