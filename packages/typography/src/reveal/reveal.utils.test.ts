import { describe, it, expect } from "vitest";

import {
  advanceWords,
  completeLength,
  countWords,
  splitWords,
} from "./reveal.utils";

describe("splitWords", () => {
  it("keeps trailing whitespace attached to each word", () => {
    expect(splitWords("one two\nthree")).toEqual(["one ", "two\n", "three"]);
  });

  it("returns no words for an empty string", () => {
    expect(splitWords("")).toEqual([]);
  });
});

describe("completeLength", () => {
  it("stops before an unfinished last word", () => {
    expect(completeLength("Hello wor")).toBe(6);
  });

  it("covers the whole text once the last word has whitespace after it", () => {
    expect(completeLength("Hello world ")).toBe(12);
  });

  it("is zero while the first word is still arriving", () => {
    expect(completeLength("Hel")).toBe(0);
  });
});

describe("countWords", () => {
  it("counts tokens with a letter or digit in them", () => {
    expect(countWords("one 2 three")).toBe(3);
  });

  it("does not count markers and dashes on their own", () => {
    expect(countWords("- > — item")).toBe(1);
  });

  it("counts words in any script", () => {
    expect(countWords("café naïve 東京")).toBe(3);
  });

  it("is zero for whitespace", () => {
    expect(countWords("   ")).toBe(0);
  });

  it("does not count an ordered-list number at the start of a line", () => {
    expect(countWords("1. ")).toBe(0);
    expect(countWords("Intro\n  2) > item")).toBe(2);
  });

  it("counts a number mid-sentence, including one that starts the counted range", () => {
    const text = "Release 1. Next ";
    expect(countWords(text)).toBe(3);
    expect(countWords(text, 8)).toBe(2);
  });

  it("only counts words between from and limit", () => {
    expect(countWords("one two three ", 4, 8)).toBe(1);
  });
});

describe("advanceWords", () => {
  const text = "one two three ";

  it("moves past the given number of words and their trailing whitespace", () => {
    expect(advanceWords(text, 0, text.length, 2)).toBe(8);
  });

  it("starts from the given offset", () => {
    expect(advanceWords(text, 4, text.length, 1)).toBe(8);
  });

  it("never moves past the limit", () => {
    expect(advanceWords(text, 0, 8, 3)).toBe(8);
  });

  it("carries markers along with the word after them", () => {
    const list = "- item next ";
    expect(advanceWords(list, 0, list.length, 1)).toBe(7);
  });

  it("carries an ordered-list number along with the word after it", () => {
    const list = "Intro\n1. item next ";
    expect(advanceWords(list, 6, list.length, 1)).toBe(14);
  });

  it("stays put when there is no whole word before the limit", () => {
    expect(advanceWords("one two", 4, 4, 1)).toBe(4);
  });
});
