// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import * as source from "@uiid/utils";
import { describe, expect, it } from "vitest";

// An app that depends only on @uiid/design-system cannot import @uiid/utils
// directly: package managers isolate a transitive dependency. This subpath is
// how it reaches the helpers without a second dependency.

const PKG_DIR = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${PKG_DIR}package.json`, "utf8"));

describe("@uiid/design-system utils surface", () => {
  it("serves the helpers from ./utils", () => {
    expect(pkg.exports["./utils"]).toEqual({
      types: "./dist/utils.d.ts",
      import: "./dist/utils.js",
    });
  });

  it("builds ./utils as its own entry", () => {
    const viteConfig = readFileSync(`${PKG_DIR}vite.config.ts`, "utf8");
    expect(viteConfig).toContain('"src/utils.ts"');
  });

  it("re-exports every @uiid/utils runtime export", async () => {
    const utils = await import("./utils");

    expect(Object.keys(utils).sort()).toEqual(Object.keys(source).sort());
    for (const name of [
      "cx",
      "cxState",
      "isRenderable",
      "prepareComponentProps",
    ]) {
      expect(utils[name as keyof typeof utils]).toBe(
        source[name as keyof typeof source],
      );
    }
  });
});
