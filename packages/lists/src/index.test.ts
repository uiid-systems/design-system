import { barrelExports } from "@uiid/config/scripts/barrel-exports.mjs";
// @vitest-environment node
import { describe, expect, it } from "vitest";

import * as lists from "./index";

// List, its parts and their prop types. The row, entries, text block, marker
// context and constants are internal.
const values = [
  "List",
  "ListDescription",
  "ListGroup",
  "ListGroupHeader",
  "ListItem",
  "ListLabel",
];

const types = [
  "ListDescriptionProps",
  "ListGroupHeaderProps",
  "ListGroupProps",
  "ListGroupRootProps",
  "ListItemOrGroup",
  "ListItemProps",
  "ListLabelProps",
  "ListMarker",
  "ListProps",
];

describe("@uiid/lists barrel", () => {
  it("exports exactly the component and its parts", () => {
    expect(Object.keys(lists).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
