// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as buttons from "./index";

// Components and their prop types only. The props of Button's internal
// subcomponents (content container, spinner, link branch) stay internal.
const values = ["Button", "ToggleButton"];

const types = [
  "ButtonColor",
  "ButtonProps",
  "ButtonVariants",
  "ToggleButtonProps",
];

describe("@uiid/buttons barrel", () => {
  it("exports exactly the components", () => {
    expect(Object.keys(buttons).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
