// @vitest-environment node
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as tokens from "./index";

const manifest = JSON.parse(
  readFileSync(`${import.meta.dirname}/../package.json`, "utf8"),
);

const values = [
  "PALETTE_HUES",
  "paletteClassName",
  "paletteColorStyles",
  "paletteVariantStyles",
];

describe("@uiid/tokens barrel", () => {
  it("exports exactly the palette names components apply", () => {
    expect(Object.keys(tokens).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, "PaletteColor"].sort(),
    );
  });
});

// These pin the manifest. They do not pack the package: run
// `pnpm pack --dry-run` in packages/tokens to see the real file list.
describe("@uiid/tokens manifest", () => {
  it("declares only the export paths the repo imports", () => {
    expect(Object.keys(manifest.exports)).toEqual([
      ".",
      "./globals.css",
      "./compositions.css",
      "./*",
    ]);
  });

  it("declares test files out of the published files", () => {
    expect(manifest.files).toEqual(["src", "dist", "!src/**/*.test.*"]);
  });
});
