import { describe, it, expect } from "vitest";

import { splitWords } from "./reveal.utils";

describe("splitWords", () => {
  it("keeps trailing whitespace attached to each word", () => {
    expect(splitWords("one two\nthree")).toEqual(["one ", "two\n", "three"]);
  });

  it("returns no words for an empty string", () => {
    expect(splitWords("")).toEqual([]);
  });
});
