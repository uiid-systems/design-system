import { describe, it, expect, vi } from "vitest";

import { getHighlighter, highlight } from "./highlighter";
import { createHighlighterCore } from "./highlighter.runtime";

vi.mock("./highlighter.runtime", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./highlighter.runtime")>();
  return {
    ...actual,
    createHighlighterCore: vi.fn(actual.createHighlighterCore),
  };
});

describe("highlighter retry", () => {
  it("tries again after the first load fails", async () => {
    vi.mocked(createHighlighterCore).mockRejectedValueOnce(
      new Error("offline"),
    );

    await expect(getHighlighter()).rejects.toThrow("offline");

    const html = await highlight("const a = 1;", "typescript");
    expect(html).toContain('class="shiki');
    expect(createHighlighterCore).toHaveBeenCalledTimes(2);
  });
});
