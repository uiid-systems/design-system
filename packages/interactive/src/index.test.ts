import { barrelExports } from "@uiid/config/scripts/barrel-exports.mjs";
// @vitest-environment node
import { describe, expect, it } from "vitest";

import * as interactive from "./index";

// Parts and their prop types only. Sortable's hooks and context value types
// are internal plumbing.
const values = [
  "Collapsible",
  "CollapsiblePanel",
  "CollapsibleRoot",
  "CollapsibleTrigger",
  "Resizable",
  "ResizableHandle",
  "ResizablePanel",
  "Sortable",
  "SortableContent",
  "SortableItem",
  "SortableItemHandle",
  "SortableOverlay",
];

const types = [
  "CollapsiblePanelProps",
  "CollapsibleProps",
  "CollapsibleRootProps",
  "CollapsibleTriggerProps",
  "ResizableHandleProps",
  "ResizablePanelProps",
  "ResizableProps",
  "SortableContentProps",
  "SortableItemHandleProps",
  "SortableItemProps",
  "SortableOverlayProps",
  "SortableRootProps",
];

describe("@uiid/interactive barrel", () => {
  it("exports exactly the parts", () => {
    expect(Object.keys(interactive).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
