// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as utils from "./index";

// @uiid/utils serves the sibling @uiid/* packages, so its barrel holds the
// names some other package imports and nothing else. Apps reach `cx` through
// `@uiid/design-system/utils`.
const values = [
  "REVEAL_DEFAULT_BLUR",
  "REVEAL_DEFAULT_DURATION",
  "cva",
  "cx",
  "definedProps",
  "hasTrigger",
  "isRenderable",
  "prepareComponentProps",
  "renderWithProps",
  "resolveRender",
  "resolveStyleProp",
  "resolveTrigger",
  "spacingPropKeys",
  "splitDomAttributes",
  "splitWords",
  "stylePropKeys",
  "togglePropKeys",
  "useComposedRefs",
];

const types = [
  "BorderProps",
  "DomAttributes",
  "LayoutProps",
  "RenderProp",
  "SizingProps",
  "SpacingProps",
  "ToggleProps",
  "VariantProps",
  "WithLayoutProps",
  "WithStringClassName",
  "WithTriggerChildren",
];

describe("@uiid/utils barrel", () => {
  it("exports exactly the runtime names other packages import", () => {
    expect(Object.keys(utils).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
