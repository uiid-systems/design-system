import { describe, it, expect } from "vitest";
import { generateComponentReference } from "./generate-reference";
import { registry } from "../manifest";

describe("generateComponentReference", () => {
  const output = generateComponentReference();

  it("returns a string containing markdown", () => {
    expect(output).toBeTypeOf("string");
    expect(output).toContain("##");
  });

  it("includes all component category sections", () => {
    const categories = [
      "Layout Components",
      "Typography",
      "Buttons",
      "Form Components",
      "Cards",
      "Overlays",
    ];
    for (const category of categories) {
      expect(output, `missing category: ${category}`).toContain(category);
    }
  });

  it("includes component names from the registry", () => {
    for (const name of Object.keys(registry)) {
      expect(output, `missing component: ${name}`).toContain(name);
    }
  });
});
