import * as barrel from "@uiid/design-system";
import * as markdown from "@uiid/markdown";
import { describe, expect, it } from "vitest";

describe("@uiid/design-system root barrel", () => {
  it("re-exports every @uiid/markdown runtime export", () => {
    const names = Object.keys(markdown);
    expect(names).toContain("Markdown");
    for (const name of names) {
      expect(barrel[name as keyof typeof barrel]).toBe(
        markdown[name as keyof typeof markdown],
      );
    }
  });
});
