// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as layout from "./index";

// Components and their prop types only.
const values = [
  "Box",
  "ConditionalRender",
  "Group",
  "Layer",
  "Separator",
  "Stack",
  "SwitchRender",
];

const types = [
  "BoxProps",
  "ConditionalRenderProps",
  "GroupProps",
  "LayerProps",
  "SeparatorProps",
  "SeparatorVariants",
  "StackProps",
  "SwitchRenderProps",
];

describe("@uiid/layout barrel", () => {
  it("exports exactly the components", () => {
    expect(Object.keys(layout).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
