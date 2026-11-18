import { describe, it, expect, vi } from "vitest";

// A mocked module only runs its factory when something imports it, so this
// set shows whether importing the highlighter alone pulls any of Shiki in.
const loaded = vi.hoisted(() => new Set<string>());

vi.mock("shiki/core", async (importOriginal) => {
  loaded.add("shiki/core");
  return importOriginal();
});
vi.mock("shiki/engine/javascript", async (importOriginal) => {
  loaded.add("shiki/engine/javascript");
  return importOriginal();
});
vi.mock("@shikijs/transformers", async (importOriginal) => {
  loaded.add("@shikijs/transformers");
  return importOriginal();
});

describe("highlighter loading", () => {
  it("loads the Shiki runtime only once something is highlighted", async () => {
    const { highlight } = await import("./highlighter");
    expect([...loaded]).toEqual([]);

    const html = await highlight("const a = 1;", "typescript");
    expect([...loaded].sort()).toEqual([
      "@shikijs/transformers",
      "shiki/core",
      "shiki/engine/javascript",
    ]);
    expect(html).toContain('class="shiki');
  });
});
