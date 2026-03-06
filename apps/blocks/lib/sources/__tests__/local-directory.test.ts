import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { LocalDirectorySource } from "../local-directory";

const TEST_DIR = join(tmpdir(), "uiid-block-source-test");

const VALID_BLOCK = {
  name: "Test Block",
  slug: "test-block",
  description: "A test block",
  version: 1,
  tags: [],
  category: "content",
  components: [],
  complexity: "low",
  elementCount: 1,
  tree: { root: "r", elements: { r: { key: "r", type: "Box", props: {} } } },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

beforeEach(async () => {
  await mkdir(TEST_DIR, { recursive: true });
});

afterEach(async () => {
  await rm(TEST_DIR, { recursive: true, force: true });
});

describe("LocalDirectorySource", () => {
  it("returns empty list when directory doesn't exist", async () => {
    const source = new LocalDirectorySource("/nonexistent/path");
    expect(await source.list()).toEqual([]);
  });

  it("returns empty list when directory has no JSON files", async () => {
    const source = new LocalDirectorySource(TEST_DIR);
    expect(await source.list()).toEqual([]);
  });

  it("reads valid block JSON files", async () => {
    await writeFile(
      join(TEST_DIR, "test-block.json"),
      JSON.stringify(VALID_BLOCK),
    );

    const source = new LocalDirectorySource(TEST_DIR);
    const blocks = await source.list();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].slug).toBe("test-block");
    expect(blocks[0].name).toBe("Test Block");
  });

  it("skips malformed JSON files", async () => {
    await writeFile(join(TEST_DIR, "bad.json"), "not json");
    await writeFile(
      join(TEST_DIR, "good.json"),
      JSON.stringify(VALID_BLOCK),
    );

    const source = new LocalDirectorySource(TEST_DIR);
    const blocks = await source.list();
    expect(blocks).toHaveLength(1);
  });

  it("skips JSON files missing required fields", async () => {
    await writeFile(
      join(TEST_DIR, "incomplete.json"),
      JSON.stringify({ name: "No slug or tree" }),
    );
    await writeFile(
      join(TEST_DIR, "good.json"),
      JSON.stringify(VALID_BLOCK),
    );

    const source = new LocalDirectorySource(TEST_DIR);
    const blocks = await source.list();
    expect(blocks).toHaveLength(1);
  });

  it("ignores non-JSON files", async () => {
    await writeFile(join(TEST_DIR, "readme.md"), "# Hello");
    await writeFile(
      join(TEST_DIR, "test.json"),
      JSON.stringify(VALID_BLOCK),
    );

    const source = new LocalDirectorySource(TEST_DIR);
    const blocks = await source.list();
    expect(blocks).toHaveLength(1);
  });

  it("gets a block by slug", async () => {
    await writeFile(
      join(TEST_DIR, "test-block.json"),
      JSON.stringify(VALID_BLOCK),
    );

    const source = new LocalDirectorySource(TEST_DIR);
    const block = await source.get("test-block");
    expect(block).not.toBeNull();
    expect(block?.name).toBe("Test Block");
  });

  it("returns null for missing slug", async () => {
    await writeFile(
      join(TEST_DIR, "test-block.json"),
      JSON.stringify(VALID_BLOCK),
    );

    const source = new LocalDirectorySource(TEST_DIR);
    expect(await source.get("nonexistent")).toBeNull();
  });

  it("uses custom name when provided", () => {
    const source = new LocalDirectorySource(TEST_DIR, "My Custom Source");
    expect(source.name).toBe("My Custom Source");
  });

  it("defaults name to local:{dir}", () => {
    const source = new LocalDirectorySource("/some/path");
    expect(source.name).toBe("local:/some/path");
  });
});
