import { describe, it, expect, vi } from "vitest";

import { getHighlighter } from "./highlighter";
import { createHighlighterCore } from "./highlighter.runtime";

// Its own file so the highlighter singleton starts empty
vi.mock("./highlighter.runtime", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./highlighter.runtime")>();
  return {
    ...actual,
    createHighlighterCore: vi.fn(actual.createHighlighterCore),
  };
});

describe("getHighlighter", () => {
  it("builds one highlighter for concurrent and later calls", async () => {
    const [first, second] = await Promise.all([
      getHighlighter(),
      getHighlighter(),
    ]);
    const later = await getHighlighter();

    expect(createHighlighterCore).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
    expect(later).toBe(first);
  });
});
