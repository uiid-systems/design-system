import { describe, it, expect } from "vitest";
import JSZip from "jszip";

import type { BlockFile } from "@uiid/blocks";

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

describe("zip roundtrip", () => {
  it("creates a zip with block files and registry metadata", async () => {
    const zip = new JSZip();

    const meta = { label: "Test Source", description: "Test", author: "Tester" };
    zip.file("registry.json", JSON.stringify(meta, null, 2) + "\n");

    const block = makeBlock("hero-card", "Hero Card");
    zip.file("hero-card.json", JSON.stringify(block, null, 2) + "\n");

    const buffer = await zip.generateAsync({ type: "uint8array" });
    expect(buffer.byteLength).toBeGreaterThan(0);

    // Unpack and verify
    const loaded = await JSZip.loadAsync(buffer);
    const metaFile = loaded.file("registry.json");
    expect(metaFile).not.toBeNull();

    const metaText = await metaFile!.async("string");
    const parsedMeta = JSON.parse(metaText);
    expect(parsedMeta.label).toBe("Test Source");
    expect(parsedMeta.description).toBe("Test");
    expect(parsedMeta.author).toBe("Tester");

    const blockFile = loaded.file("hero-card.json");
    expect(blockFile).not.toBeNull();

    const blockText = await blockFile!.async("string");
    const parsedBlock = JSON.parse(blockText);
    expect(parsedBlock.slug).toBe("hero-card");
    expect(parsedBlock.name).toBe("Hero Card");
    expect(parsedBlock.tree).toBeDefined();
  });

  it("handles zip with no registry.json", async () => {
    const zip = new JSZip();
    const block = makeBlock("solo-block");
    zip.file("solo-block.json", JSON.stringify(block, null, 2) + "\n");

    const buffer = await zip.generateAsync({ type: "uint8array" });
    const loaded = await JSZip.loadAsync(buffer);

    expect(loaded.file("registry.json")).toBeNull();

    const blockFile = loaded.file("solo-block.json");
    expect(blockFile).not.toBeNull();
  });

  it("skips non-json files and invalid blocks", async () => {
    const zip = new JSZip();

    zip.file("readme.txt", "This is not a block");
    zip.file("not-a-block.json", JSON.stringify({ foo: "bar" }));
    zip.file("valid.json", JSON.stringify(makeBlock("valid"), null, 2));

    const buffer = await zip.generateAsync({ type: "uint8array" });
    const loaded = await JSZip.loadAsync(buffer);

    let validCount = 0;
    for (const [path, entry] of Object.entries(loaded.files)) {
      if (entry.dir || !path.endsWith(".json") || path === "registry.json") continue;
      const content = await entry.async("string");
      try {
        const parsed = JSON.parse(content);
        if (parsed.name && parsed.slug && parsed.tree) validCount++;
      } catch {
        // skip
      }
    }

    expect(validCount).toBe(1);
  });

  it("strips _source property during export", () => {
    const block = makeBlock("test");
    const withSource = { ...block, _source: "Built-in Blocks" };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _source, ...exported } = withSource;

    expect(exported).not.toHaveProperty("_source");
    expect(exported.slug).toBe("test");
    expect(exported.tree).toBeDefined();
  });

  it("roundtrips multiple blocks", async () => {
    const zip = new JSZip();
    const blocks = [makeBlock("a"), makeBlock("b"), makeBlock("c")];

    for (const block of blocks) {
      zip.file(`${block.slug}.json`, JSON.stringify(block, null, 2) + "\n");
    }

    const buffer = await zip.generateAsync({ type: "uint8array" });
    const loaded = await JSZip.loadAsync(buffer);

    const jsonFiles = Object.keys(loaded.files).filter(
      (p) => p.endsWith(".json") && !loaded.files[p].dir,
    );
    expect(jsonFiles).toHaveLength(3);
    expect(jsonFiles.sort()).toEqual(["a.json", "b.json", "c.json"]);
  });
});
