import { describe, it, expect } from "vitest";
import {
  registry,
  componentNames,
  getComponentsByCategory,
  getComponentsByPackage,
} from "./manifest";

const EXPECTED_NAMES = [
  "Box",
  "Stack",
  "Group",
  "Layer",
  "Separator",
  "Button",
  "ToggleButton",
  "Form",
  "Input",
  "Textarea",
  "Checkbox",
  "Select",
  "Switch",
  "Text",
  "Card",
  "Drawer",
  "Modal",
  "Popover",
  "Sheet",
  "Toaster",
  "Tooltip",
];

describe("registry", () => {
  it("contains all expected component names", () => {
    for (const name of EXPECTED_NAMES) {
      expect(registry).toHaveProperty(name);
    }
  });

  it("every entry has required fields", () => {
    for (const [, entry] of Object.entries(registry)) {
      expect(entry.name).toBeTypeOf("string");
      expect(entry.package).toBeTypeOf("string");
      expect(entry.propsSchema).toBeDefined();
      expect(typeof entry.hasChildren).toBe("boolean");
    }
  });

  it("entry name matches its registry key", () => {
    for (const [key, entry] of Object.entries(registry)) {
      expect(entry.name).toBe(key);
    }
  });
});

describe("componentNames", () => {
  it("matches Object.keys(registry)", () => {
    expect(componentNames).toEqual(Object.keys(registry));
  });
});

describe("getComponentsByCategory", () => {
  it("returns layout components", () => {
    const layouts = getComponentsByCategory("layout");
    const names = layouts.map((e) => e.name);
    expect(names).toContain("Box");
    expect(names).toContain("Stack");
    expect(names).toContain("Group");
  });

  it("returns form components", () => {
    const forms = getComponentsByCategory("forms");
    const names = forms.map((e) => e.name);
    expect(names).toContain("Input");
    expect(names).toContain("Select");
  });

  it("returns empty array for unknown category", () => {
    expect(getComponentsByCategory("nonexistent")).toEqual([]);
  });
});

describe("getComponentsByPackage", () => {
  it("returns components for @uiid/layout", () => {
    const layouts = getComponentsByPackage("@uiid/layout");
    const names = layouts.map((e) => e.name);
    expect(names).toContain("Box");
    expect(names).toContain("Stack");
  });

  it("returns components for @uiid/buttons", () => {
    const buttons = getComponentsByPackage("@uiid/buttons");
    const names = buttons.map((e) => e.name);
    expect(names).toContain("Button");
  });

  it("returns empty array for unknown package", () => {
    expect(getComponentsByPackage("@uiid/nonexistent")).toEqual([]);
  });
});
