import { describe, it, expect } from "vitest";
import { countComponents } from "./count-components";
import { registry } from "../manifest";

describe("countComponents", () => {
  it("counts a single element", () => {
    const result = countComponents({
      elements: {
        root: { type: "Button" },
      },
    });
    expect(result).toEqual({ counts: { Button: 1 }, total: 1, unique: 1 });
  });

  it("counts multiple elements with repeated types", () => {
    const result = countComponents({
      elements: {
        card: { type: "Card" },
        body: { type: "Text" },
        footer: { type: "Group" },
        cancel: { type: "Button" },
        save: { type: "Button" },
      },
    });
    expect(result.counts).toEqual({ Card: 1, Text: 1, Group: 1, Button: 2 });
    expect(result.total).toBe(5);
    expect(result.unique).toBe(4);
  });

  it("returns zeroes for an empty tree", () => {
    const result = countComponents({ elements: {} });
    expect(result).toEqual({ counts: {}, total: 0, unique: 0 });
  });

  it("counts all elements of a single type", () => {
    const result = countComponents({
      elements: {
        a: { type: "Text" },
        b: { type: "Text" },
        c: { type: "Text" },
      },
    });
    expect(result).toEqual({ counts: { Text: 3 }, total: 3, unique: 1 });
  });

  it("works with registry preview trees", () => {
    const entriesWithPreviews = Object.values(registry).filter(
      (entry) => entry.previews && entry.previews.length > 0
    );

    expect(entriesWithPreviews.length).toBeGreaterThan(0);

    for (const entry of entriesWithPreviews) {
      for (const preview of entry.previews!) {
        const result = countComponents(preview.tree);
        expect(result.total).toBeGreaterThan(0);
        expect(result.unique).toBeGreaterThan(0);
        expect(result.unique).toBeLessThanOrEqual(result.total);
        expect(Object.values(result.counts).reduce((a, b) => a + b, 0)).toBe(
          result.total
        );
      }
    }
  });
});
