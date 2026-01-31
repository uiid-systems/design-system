import { describe, it, expect } from "vitest";
import { z } from "zod";
import { extractPropsFromSchema, generateComponentDocs } from "./schema-to-docs";
import type { ComponentEntry } from "../types";

describe("extractPropsFromSchema", () => {
  it("returns correct types for primitive fields", () => {
    const schema = z.object({
      name: z.string(),
      count: z.number(),
      active: z.boolean(),
    });
    const props = extractPropsFromSchema(schema);
    const byName = Object.fromEntries(props.map((p) => [p.name, p]));

    expect(byName.name.type).toBe("string");
    expect(byName.count.type).toBe("number");
    expect(byName.active.type).toBe("boolean");
  });

  it("returns correct type for enum fields", () => {
    const schema = z.object({
      size: z.enum(["small", "medium", "large"]),
    });
    const props = extractPropsFromSchema(schema);
    expect(props[0].type).toBe('"small" | "medium" | "large"');
    expect(props[0].enumValues).toEqual(["small", "medium", "large"]);
  });

  it("handles optional fields", () => {
    const schema = z.object({
      required: z.string(),
      optional: z.string().optional(),
    });
    const props = extractPropsFromSchema(schema);
    const byName = Object.fromEntries(props.map((p) => [p.name, p]));

    expect(byName.required.required).toBe(true);
    expect(byName.optional.required).toBe(false);
    // Type should still be "string" after unwrapping optional
    expect(byName.optional.type).toBe("string");
  });

  it("handles union types", () => {
    const schema = z.object({
      value: z.union([z.number(), z.literal("auto")]),
    });
    const props = extractPropsFromSchema(schema);
    expect(props[0].type).toBe('number | "auto"');
  });

  it("handles array types", () => {
    const schema = z.object({
      items: z.array(z.string()),
    });
    const props = extractPropsFromSchema(schema);
    expect(props[0].type).toBe("string[]");
  });

  it("handles nested object types", () => {
    const schema = z.object({
      config: z.object({ key: z.string() }),
    });
    const props = extractPropsFromSchema(schema);
    expect(props[0].type).toBe("object");
  });

  it("applies defaults from second argument", () => {
    const schema = z.object({
      size: z.enum(["small", "medium", "large"]).optional(),
    });
    const props = extractPropsFromSchema(schema, { size: "medium" });
    expect(props[0].defaultValue).toBe("medium");
  });

  it("returns empty array for non-object schemas", () => {
    expect(extractPropsFromSchema(z.string())).toEqual([]);
  });

  it("unwraps optional/nullable wrappers on the root schema", () => {
    const schema = z
      .object({ x: z.number() })
      .optional();
    const props = extractPropsFromSchema(schema);
    expect(props).toHaveLength(1);
    expect(props[0].name).toBe("x");
  });

  it("extracts enum values from optional enum", () => {
    const schema = z.object({
      tone: z.enum(["positive", "critical"]).optional(),
    });
    const props = extractPropsFromSchema(schema);
    expect(props[0].enumValues).toEqual(["positive", "critical"]);
  });
});

describe("generateComponentDocs", () => {
  it("produces valid ComponentDocumentation", () => {
    const entry: ComponentEntry = {
      name: "TestButton",
      package: "@uiid/buttons",
      hasChildren: true,
      propsSchema: z.object({
        label: z.string(),
        size: z.enum(["small", "large"]).optional(),
      }),
      description: "A test button",
      category: "buttons",
      defaults: { size: "small" },
    };

    const docs = generateComponentDocs(entry);

    expect(docs.name).toBe("TestButton");
    expect(docs.package).toBe("@uiid/buttons");
    expect(docs.description).toBe("A test button");
    expect(docs.category).toBe("buttons");
    expect(docs.hasChildren).toBe(true);
    expect(docs.props).toHaveLength(2);

    const sizeDoc = docs.props.find((p) => p.name === "size");
    expect(sizeDoc?.defaultValue).toBe("small");
    expect(sizeDoc?.enumValues).toEqual(["small", "large"]);
  });
});
