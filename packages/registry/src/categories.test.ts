import { describe, it, expect } from "vitest";
import { categories, categoryKeys } from "./categories";
import { registry } from "./manifest";

describe("categories", () => {
  it("is non-empty", () => {
    expect(categories.length).toBeGreaterThan(0);
  });

  it("every entry has a key and label", () => {
    for (const cat of categories) {
      expect(cat.key).toBeTypeOf("string");
      expect(cat.key.length).toBeGreaterThan(0);
      expect(cat.label).toBeTypeOf("string");
      expect(cat.label.length).toBeGreaterThan(0);
    }
  });

  it("categoryKeys has no duplicates", () => {
    const unique = new Set(categoryKeys);
    expect(unique.size).toBe(categoryKeys.length);
  });

  it("every registry entry's category is a valid category key", () => {
    for (const [name, entry] of Object.entries(registry)) {
      if (entry.category) {
        expect(
          categoryKeys,
          `${name} has invalid category "${entry.category}"`
        ).toContain(entry.category);
      }
    }
  });
});
