import * as ai from "@uiid/ai";
import { describe, expect, it } from "vitest";

describe("@uiid/ai barrel", () => {
  it("resolves from source and has no runtime exports", () => {
    expect(Object.keys(ai)).toEqual([]);
  });
});
