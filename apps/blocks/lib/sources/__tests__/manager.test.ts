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
    const { blocks, errors } = await manager.list();
    expect(blocks).toEqual([]);
    expect(errors).toEqual([]);
  });

  it("returns null for get when no sources are added", async () => {
    const manager = new BlockSourceManager();
    expect(await manager.get("anything")).toBeNull();
  });

  it("lists blocks from a single source", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("test", [makeBlock("a"), makeBlock("b")]));

    const { blocks } = await manager.list();
    expect(blocks).toHaveLength(2);
    expect(blocks[0].slug).toBe("a");
    expect(blocks[1].slug).toBe("b");
  });

  it("tags blocks with _source metadata", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("my-source", [makeBlock("a")]));

    const { blocks } = await manager.list();
    expect(blocks[0]._source).toBe("my-source");
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

    const { blocks } = await manager.list();
    expect(blocks).toHaveLength(2);
    expect(blocks.map((b) => b.slug)).toEqual(["a", "b"]);
  });

  it("resolves duplicate slugs by priority (first source wins)", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("first", [makeBlock("dup", "First Version")]));
    manager.addSource(makeSource("second", [makeBlock("dup", "Second Version")]));

    const { blocks } = await manager.list();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].name).toBe("First Version");
    expect(blocks[0]._source).toBe("first");
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

  it("captures errors from failing sources while returning blocks from others", async () => {
    const manager = new BlockSourceManager();
    manager.addSource(makeSource("good", [makeBlock("a")]));
    manager.addSource({
      name: "bad",
      list: async () => { throw new Error("Connection refused"); },
      get: async () => { throw new Error("Connection refused"); },
    });
    manager.addSource(makeSource("also-good", [makeBlock("b")]));

    const { blocks, errors } = await manager.list();
    expect(blocks).toHaveLength(2);
    expect(blocks.map((b) => b.slug)).toEqual(["a", "b"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].source).toBe("bad");
    expect(errors[0].error).toBe("Connection refused");
  });

  it("get() skips failing sources and continues", async () => {
    const manager = new BlockSourceManager();
    manager.addSource({
      name: "broken",
      list: async () => { throw new Error("fail"); },
      get: async () => { throw new Error("fail"); },
    });
    manager.addSource(makeSource("working", [makeBlock("a")]));

    const result = await manager.get("a");
    expect(result?.slug).toBe("a");
    expect(result?._source).toBe("working");
  });
});
