// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as icons from "./index";
import * as lucide from "./lucide-icons.generated";

// Thousands of icon names cannot be listed by hand, so the exact surface is the
// generated lucide set plus the names listed here. src/module-graph.test.ts
// checks the generated set for shape and completeness; nothing compares it
// with lucide's own catalogue.
const additions = ["LoadingSpinnerIcon"];
const types = ["Icon", "IconProps", "LoadingSpinnerIconProps"];

describe("@uiid/icons barrel", () => {
  it("exports exactly the generated lucide icons and the uiid additions", () => {
    expect(Object.keys(icons).sort()).toEqual(
      [...Object.keys(lucide), ...additions].sort(),
    );
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...Object.keys(lucide), ...additions, ...types].sort(),
    );
  });

  it("exports icons only, each under its `*Icon` name", () => {
    const notIcons = Object.keys(icons).filter((name) => !/Icon$/.test(name));
    expect(notIcons).toEqual([]);
  });
});
