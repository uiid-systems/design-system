import { describe, expect, it } from "vitest";

import * as custom from "./custom";
import * as icons from "./index";
import * as lucide from "./lucide-icons.generated";

// Thousands of icon names cannot be listed by hand, so the exact surface is the
// generated lucide set plus the uiid additions, and nothing else.
describe("@uiid/icons barrel", () => {
  it("exports exactly the generated lucide icons and the uiid additions", () => {
    const expected = [...Object.keys(lucide), ...Object.keys(custom)].sort();
    expect(Object.keys(icons).sort()).toEqual(expected);
    expect(Object.keys(custom)).toEqual(["LoadingSpinnerIcon"]);
  });

  it("exports icons only, each under its `*Icon` name", () => {
    const notIcons = Object.keys(icons).filter((name) => !/Icon$/.test(name));
    expect(notIcons).toEqual([]);
    expect(icons).not.toHaveProperty("createLucideIcon");
  });
});
