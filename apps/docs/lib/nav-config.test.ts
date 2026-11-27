import { describe, expect, it } from "vitest";

import { NAV } from "../nav";
import { isNavGroup, listNavItems } from "./nav";

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
});
