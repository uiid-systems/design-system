import { describe, it, expect } from "vitest";

import { BlocksConfigSchema, SourceEntrySchema } from "../config";

describe("SourceEntrySchema", () => {
  it("validates a bundled source", () => {
    const result = SourceEntrySchema.parse({
      type: "bundled",
      label: "Built-in",
      mode: "read",
      enabled: true,
    });
    expect(result.type).toBe("bundled");
    expect(result.label).toBe("Built-in");
  });

  it("validates a local source with path", () => {
    const result = SourceEntrySchema.parse({
      type: "local",
      path: "./my-blocks",
      label: "My Blocks",
      mode: "read-write",
      enabled: true,
    });
    expect(result.path).toBe("./my-blocks");
    expect(result.mode).toBe("read-write");
  });

  it("applies default mode and enabled", () => {
    const result = SourceEntrySchema.parse({
      type: "local",
      label: "Test",
    });
    expect(result.mode).toBe("read");
    expect(result.enabled).toBe(true);
  });

  it("rejects invalid type", () => {
    expect(() =>
      SourceEntrySchema.parse({
        type: "invalid",
        label: "Bad",
      }),
    ).toThrow();
  });

  it("rejects invalid mode", () => {
    expect(() =>
      SourceEntrySchema.parse({
        type: "local",
        label: "Bad",
        mode: "write-only",
      }),
    ).toThrow();
  });

  it("rejects missing label", () => {
    expect(() =>
      SourceEntrySchema.parse({
        type: "bundled",
      }),
    ).toThrow();
  });

  it("accepts optional description and author", () => {
    const result = SourceEntrySchema.parse({
      type: "local",
      path: "./community",
      label: "Community Blocks",
      description: "Curated component patterns",
      author: "UIID Team",
    });
    expect(result.description).toBe("Curated component patterns");
    expect(result.author).toBe("UIID Team");
  });

  it("omits description and author when not provided", () => {
    const result = SourceEntrySchema.parse({
      type: "bundled",
      label: "Built-in",
    });
    expect(result.description).toBeUndefined();
    expect(result.author).toBeUndefined();
  });
});

describe("BlocksConfigSchema", () => {
  it("validates a full config", () => {
    const result = BlocksConfigSchema.parse({
      sources: [
        { type: "bundled", label: "Built-in", mode: "read", enabled: true },
        {
          type: "local",
          path: "./blocks",
          label: "Local",
          mode: "read-write",
          enabled: true,
        },
      ],
    });
    expect(result.sources).toHaveLength(2);
  });

  it("validates an empty sources array", () => {
    const result = BlocksConfigSchema.parse({ sources: [] });
    expect(result.sources).toHaveLength(0);
  });

  it("rejects missing sources field", () => {
    expect(() => BlocksConfigSchema.parse({})).toThrow();
  });

  it("rejects non-array sources", () => {
    expect(() => BlocksConfigSchema.parse({ sources: "bad" })).toThrow();
  });
});
