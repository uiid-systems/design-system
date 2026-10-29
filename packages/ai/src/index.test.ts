import * as ai from "@uiid/ai";
import { describe, expect, it } from "vitest";

describe("@uiid/ai barrel", () => {
  it("resolves from source and exports only Markdown at runtime", () => {
    expect(Object.keys(ai)).toEqual(["Markdown"]);
  });
});
