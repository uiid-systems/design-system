import { describe, it, expect, vi } from "vitest";

// A mocked module only runs its factory when something imports it, so this
// flag shows whether importing the highlighter alone pulls Shiki in.
const shiki = vi.hoisted(() => ({ loaded: false }));

vi.mock("shiki/core", async (importOriginal) => {
  shiki.loaded = true;
  return importOriginal();
});

describe("highlighter loading", () => {
  it("loads the Shiki runtime only once something is highlighted", async () => {
    const { highlight } = await import("./highlighter");
    expect(shiki.loaded).toBe(false);

    const html = await highlight("const a = 1;", "typescript");
    expect(shiki.loaded).toBe(true);
    expect(html).toContain('class="shiki');
  });
});
