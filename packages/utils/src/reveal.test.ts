import { describe, it, expect } from "vitest";

import {
  REVEAL_DEFAULT_BLUR,
  REVEAL_DEFAULT_DURATION,
  splitWords,
} from "./reveal";

describe("reveal defaults", () => {
  it("fades each word in over 400ms from a 6px blur", () => {
    expect(REVEAL_DEFAULT_DURATION).toBe(400);
    expect(REVEAL_DEFAULT_BLUR).toBe(6);
  });
});

describe("splitWords", () => {
  it("keeps trailing whitespace attached to each word", () => {
    expect(splitWords("one two\nthree")).toEqual(["one ", "two\n", "three"]);
  });

  it("returns no words for an empty string", () => {
    expect(splitWords("")).toEqual([]);
  });
});
