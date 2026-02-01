import { describe, it, expect } from "vitest";
import type { z } from "zod";
import { registry, componentNames } from "../manifest";
import { categoryKeys } from "../categories";

describe("component entry integrity", () => {
  it("every component has a valid category", () => {
    for (const [name, entry] of Object.entries(registry)) {
      if (entry.category) {
        expect(
          categoryKeys,
          `${name} has invalid category "${entry.category}"`
        ).toContain(entry.category);
      }
    }
  });

  it("every component propsSchema is a valid Zod schema", () => {
    for (const [name, entry] of Object.entries(registry)) {
      expect(
        typeof entry.propsSchema.safeParse,
        `${name} propsSchema missing safeParse`
      ).toBe("function");
      // Should not throw when parsing empty object
      const result = entry.propsSchema.safeParse({});
      expect(result).toHaveProperty("success");
    }
  });

  it("defaults keys are valid prop names in the schema", () => {
    for (const [name, entry] of Object.entries(registry)) {
      if (!entry.defaults || Object.keys(entry.defaults).length === 0) continue;
      // Get the schema shape to check each default key individually
      const shape =
        "shape" in entry.propsSchema
          ? (entry.propsSchema as z.ZodObject<z.ZodRawShape>).shape
          : null;
      if (!shape) continue;
      for (const key of Object.keys(entry.defaults)) {
        expect(
          shape,
          `${name} default key "${key}" not found in schema shape`
        ).toHaveProperty(key);
      }
    }
  });
});

describe("preview tree integrity", () => {
  for (const [name, entry] of Object.entries(registry)) {
    if (!entry.previews || entry.previews.length === 0) continue;

    describe(`${name} previews`, () => {
      for (const preview of entry.previews!) {
        describe(`preview: "${preview.label}"`, () => {
          it("has a label and tree with root and elements", () => {
            expect(preview.label).toBeTypeOf("string");
            expect(preview.tree).toBeDefined();
            expect(preview.tree.root).toBeTypeOf("string");
            expect(preview.tree.elements).toBeDefined();
          });

          it("root key exists in elements", () => {
            expect(preview.tree.elements).toHaveProperty(preview.tree.root);
          });

          it("all children keys reference existing elements", () => {
            for (const [key, element] of Object.entries(
              preview.tree.elements
            )) {
              if (!element.children) continue;
              for (const childKey of element.children) {
                expect(
                  preview.tree.elements,
                  `${name}/${preview.label}: child "${childKey}" of element "${key}" not found in elements`
                ).toHaveProperty(childKey);
              }
            }
          });

          it("all parentKey values reference existing elements", () => {
            for (const [key, element] of Object.entries(
              preview.tree.elements
            )) {
              if (!element.parentKey) continue;
              expect(
                preview.tree.elements,
                `${name}/${preview.label}: parentKey "${element.parentKey}" of element "${key}" not found`
              ).toHaveProperty(element.parentKey);
            }
          });

          it("all element type values reference registered component names", () => {
            for (const [key, element] of Object.entries(
              preview.tree.elements
            )) {
              expect(
                componentNames,
                `${name}/${preview.label}: element "${key}" has type "${element.type}" which is not a registered component`
              ).toContain(element.type);
            }
          });
        });
      }
    });
  }
});
