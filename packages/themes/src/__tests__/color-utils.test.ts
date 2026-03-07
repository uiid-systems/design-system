import { describe, it, expect } from "vitest";
import { contrastRatio, computeColorMix, hexToSrgb, oklchToHex } from "../utils/color-utils";

describe("contrastRatio", () => {
  it("returns 21:1 for black on white", () => {
    const ratio = contrastRatio("#000000", "#ffffff");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 1:1 for identical colors", () => {
    const ratio = contrastRatio("#336699", "#336699");
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("is symmetric", () => {
    const a = contrastRatio("#ff0000", "#ffffff");
    const b = contrastRatio("#ffffff", "#ff0000");
    expect(a).toBeCloseTo(b, 5);
  });
});

describe("computeColorMix", () => {
  it("returns color1 at ratio 0", () => {
    const result = computeColorMix("#ff0000", "#0000ff", 0);
    expect(result).toBe("#ff0000");
  });

  it("returns color2 at ratio 1", () => {
    const result = computeColorMix("#ff0000", "#0000ff", 1);
    expect(result).toBe("#0000ff");
  });

  it("produces a valid hex at ratio 0.5", () => {
    const result = computeColorMix("#ff0000", "#0000ff", 0.5);
    expect(result).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe("hexToSrgb", () => {
  it("parses black", () => {
    expect(hexToSrgb("#000000")).toEqual([0, 0, 0]);
  });

  it("parses white", () => {
    expect(hexToSrgb("#ffffff")).toEqual([1, 1, 1]);
  });

  it("throws on invalid hex", () => {
    expect(() => hexToSrgb("invalid")).toThrow("Invalid hex");
  });
});

describe("oklchToHex", () => {
  it("produces a valid hex string", () => {
    const result = oklchToHex(0.5, 0.1, 180);
    expect(result).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
