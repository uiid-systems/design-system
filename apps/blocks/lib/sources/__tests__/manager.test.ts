import { describe, it, expect } from "vitest";

import type { BlockFile } from "@uiid/blocks";

import { BlockSourceManager } from "../manager";
import type { BlockSource } from "../types";

function makeBlock(slug: string, name?: string): BlockFile {
  return {
    name: name ?? slug,
    slug,
    description: "",
    version: 1,
    tags: [],
    category: "content",
    components: [],
    complexity: "low",
    elementCount: 0,
    tree: { root: "r", elements: { r: { key: "r", type: "Box", props: {} } } },
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };
}

function makeSource(name: string, blocks: BlockFile[]): BlockSource {
  return {
    name,
    list: async () => blocks,
    get: async (slug) => blocks.find((b) => b.slug === slug) ?? null,
  };
}

describe("BlockSourceManager", () => {
  it("returns empty list when no sources are added", async () => {
    const manager = new BlockSourceManager();
    expect(await manager.list()).toEqual([]);
  });

  it("returns null for get when no sources are added", async () => {
    const manager = new BlockSourceManager();
    expect(await manager.get("anything")).toBeNull();
  });

  it("lists blocks from a single source", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("test", [makeBlock("a"), makeBlock("b")]));

    const result = await manager.list();
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe("a");
    expect(result[1].slug).toBe("b");
  });

  it("tags blocks with _source metadata", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("my-source", [makeBlock("a")]));

    const result = await manager.list();
    expect(result[0]._source).toBe("my-source");
  });

  it("tags get() results with _source metadata", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("my-source", [makeBlock("a")]));

    const result = await manager.get("a");
    expect(result?._source).toBe("my-source");
  });

  it("aggregates blocks from multiple sources", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("first", [makeBlock("a")]));
    manager.addSource(makeSource("second", [makeBlock("b")]));

    const result = await manager.list();
    expect(result).toHaveLength(2);
    expect(result.map((b) => b.slug)).toEqual(["a", "b"]);
  });

  it("resolves duplicate slugs by priority (first source wins)", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("first", [makeBlock("dup", "First Version")]));
    manager.addSource(makeSource("second", [makeBlock("dup", "Second Version")]));

    const result = await manager.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("First Version");
    expect(result[0]._source).toBe("first");
  });

  it("get() returns first source match for duplicate slugs", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("first", [makeBlock("dup", "First")]));
    manager.addSource(makeSource("second", [makeBlock("dup", "Second")]));

    const result = await manager.get("dup");
    expect(result?.name).toBe("First");
    expect(result?._source).toBe("first");
  });

  it("get() falls through to second source when first doesn't have slug", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("first", [makeBlock("a")]));
    manager.addSource(makeSource("second", [makeBlock("b")]));

    const result = await manager.get("b");
    expect(result?.slug).toBe("b");
    expect(result?._source).toBe("second");
  });

  it("get() returns null when no source has the slug", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("first", [makeBlock("a")]));

    expect(await manager.get("nonexistent")).toBeNull();
  });
});
