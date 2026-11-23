// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as typography from "./index";

// Components and their prop types only. The streaming hooks moved to
// @uiid/markdown, their only consumer, and stay internal there.
const values = ["Number", "Prose", "Reveal", "Shimmer", "Text"];

const types = [
  "NumberProps",
  "ProseProps",
  "RevealProps",
  "ShimmerProps",
  "TextProps",
  "TextVariants",
];

describe("@uiid/typography barrel", () => {
  it("exports exactly the components", () => {
    expect(Object.keys(typography).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
