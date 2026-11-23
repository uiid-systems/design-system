// @vitest-environment node
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import * as tokens from "./index";

const manifest = JSON.parse(
  readFileSync(`${import.meta.dirname}/../package.json`, "utf8"),
);

describe("@uiid/tokens barrel", () => {
  it("exports exactly the palette names components apply", () => {
    expect(Object.keys(tokens).sort()).toEqual([
      "PALETTE_HUES",
      "paletteClassName",
      "paletteColorStyles",
      "paletteVariantStyles",
    ]);
  });

  it("serves only the export paths something imports", () => {
    expect(Object.keys(manifest.exports)).toEqual([
      ".",
      "./globals.css",
      "./compositions.css",
      "./*",
    ]);
  });

  it("leaves tests out of the published files", () => {
    expect(manifest.files).toEqual(["src", "dist", "!src/**/*.test.ts"]);
  });
});
