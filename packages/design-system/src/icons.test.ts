// @vitest-environment node
// Reads files and shells out; needs no DOM.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

// This package is the facade an app depends on, so it is where the icon set is
// most easily re-introduced by accident. `export * as Icons from "@uiid/icons"`
// used to live in the root barrel, which meant importing a single component
// pulled lucide's whole icon set into the consumer's module graph.

const PKG_DIR = fileURLToPath(new URL("..", import.meta.url));
const ICONS_PKG_DIR = fileURLToPath(new URL("../../icons/", import.meta.url));

const pkg = JSON.parse(readFileSync(`${PKG_DIR}package.json`, "utf8"));

beforeAll(() => {
  // The forwarders are generated from @uiid/icons's own generated output, so both
  // have to exist. Emitted in place (--no-clean) for the same reason as in
  // @uiid/icons: consumers and the editor resolve against this output.
  execFileSync("node", ["scripts/emit-per-icon-modules.mjs", "--no-clean"], {
    cwd: ICONS_PKG_DIR,
    stdio: "pipe",
  });
  execFileSync("node", ["scripts/emit-icon-forwarders.mjs", "--no-clean"], {
    cwd: PKG_DIR,
    stdio: "pipe",
  });
}, 180_000);

describe("@uiid/design-system icon surface", () => {
  it("keeps icons out of the root barrel", () => {
    const barrel = readFileSync(`${PKG_DIR}src/index.ts`, "utf8");
    const iconExport = /^\s*export\s[^\n]*from\s*"@uiid\/icons"/m;

    expect(barrel).not.toMatch(iconExport);
  });

  it("serves icons from ./icons and one module per icon from ./icons/*", () => {
    expect(pkg.exports["./icons"]).toEqual({
      types: "./dist/icons.d.ts",
      import: "./dist/icons.js",
    });
    expect(pkg.exports["./icons/*"]).toEqual({
      types: "./icons/*.d.ts",
      import: "./icons/*.js",
    });
  });

  it("ships the generated forwarders", () => {
    expect(pkg.files).toContain("icons");
  });

  // The point of the facade: an app that depends only on @uiid/design-system can
  // still reach one icon, which it cannot do through @uiid/icons directly —
  // package managers isolate a transitive dependency's subpaths.
  it("forwards a per-icon subpath onto @uiid/icons", () => {
    for (const icon of ["globe", "external-link", "loading-spinner"]) {
      expect(existsSync(`${PKG_DIR}icons/${icon}.js`)).toBe(true);
      expect(existsSync(`${PKG_DIR}icons/${icon}.d.ts`)).toBe(true);
      expect(readFileSync(`${PKG_DIR}icons/${icon}.js`, "utf8")).toBe(
        `export * from "@uiid/icons/${icon}";\n`,
      );
    }
  });
});
