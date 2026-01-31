import { describe, it, expect } from "vitest";
import { generateComponentReference } from "./generate-reference";
import { categories } from "../categories";
import { registry } from "../manifest";

describe("generateComponentReference", () => {
  const output = generateComponentReference();

  it("returns a string containing markdown", () => {
    expect(output).toBeTypeOf("string");
    expect(output).toContain("##");
  });

  it("includes all component category sections", () => {
    for (const { label } of categories) {
      expect(output, `missing category: ${label}`).toContain(label);
    }
  });

  it("includes component names from the registry", () => {
    for (const name of Object.keys(registry)) {
      expect(output, `missing component: ${name}`).toContain(name);
    }
  });
});
