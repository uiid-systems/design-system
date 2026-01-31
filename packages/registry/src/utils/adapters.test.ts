import { describe, it, expect } from "vitest";
import { getPackageMap, getCatalogEntries } from "./adapters";
import { registry } from "../manifest";

describe("getPackageMap", () => {
  it("returns a name-to-package mapping for all registered components", () => {
    const map = getPackageMap();
    const registryKeys = Object.keys(registry);

    expect(Object.keys(map)).toEqual(registryKeys);

    for (const [name, entry] of Object.entries(registry)) {
      expect(map[name]).toBe(entry.package);
    }
  });
});

describe("getCatalogEntries", () => {
  it("returns entries with expected shape for all components", () => {
    const entries = getCatalogEntries();
    const registryKeys = Object.keys(registry);

    expect(Object.keys(entries)).toEqual(registryKeys);

    for (const [name, catalogEntry] of Object.entries(entries)) {
      expect(catalogEntry).toHaveProperty("props");
      expect(catalogEntry).toHaveProperty("hasChildren");
      expect(typeof catalogEntry.hasChildren).toBe("boolean");
      expect(catalogEntry.hasChildren).toBe(registry[name].hasChildren);
    }
  });
});
