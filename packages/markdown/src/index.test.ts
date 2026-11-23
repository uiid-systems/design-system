// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as markdown from "./index";

// The streaming hooks behind `reveal` live in this package and are not exported.
const values = ["Markdown"];

const types = ["MarkdownOverrides", "MarkdownProps"];

describe("@uiid/markdown barrel", () => {
  it("exports exactly the component", () => {
    expect(Object.keys(markdown).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
