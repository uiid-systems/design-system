import { describe, expect, it } from "vitest";

import { resolveItemKey, resolveItemLabel } from "./item-utils";

describe("resolveItemLabel", () => {
  it("prefers the formatter", () => {
    expect(resolveItemLabel({ id: 1 }, () => "One")).toBe("One");
  });

  it("falls back to an object's label, then its value field", () => {
    expect(resolveItemLabel({ value: "a", label: "Alpha" })).toBe("Alpha");
    expect(resolveItemLabel({ value: 2 })).toBe("2");
  });

  it("stringifies a primitive", () => {
    expect(resolveItemLabel("apple")).toBe("apple");
    expect(resolveItemLabel(3)).toBe("3");
  });

  it("never yields [object Object]", () => {
    expect(resolveItemLabel({ id: 1 })).toBeUndefined();
    expect(resolveItemLabel({ value: { id: 1 } })).toBeUndefined();
    expect(resolveItemLabel(null)).toBeUndefined();
  });
});

describe("resolveItemKey", () => {
  const item = { id: 7, name: "Seven", value: "seven" };

  it("keys a string or number by itself", () => {
    expect(resolveItemKey("apple", 0)).toBe("apple");
    expect(resolveItemKey(4, 0)).toBe(4);
  });

  it("falls back through itemToStringValue, itemToStringLabel, value, index", () => {
    const itemToStringValue = (v: typeof item) => String(v.id);
    const itemToStringLabel = (v: typeof item) => v.name;

    expect(
      resolveItemKey(item, 0, { itemToStringValue, itemToStringLabel }),
    ).toBe("7");
    expect(resolveItemKey(item, 0, { itemToStringLabel })).toBe("Seven");
    expect(resolveItemKey(item, 0)).toBe("seven");
    expect(resolveItemKey({ id: 7 }, 3)).toBe(3);
  });
});
