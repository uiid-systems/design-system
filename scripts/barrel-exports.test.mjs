// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { barrelExports } from "./barrel-exports.mjs";

const dirs = [];
const fixture = (files) => {
  const dir = mkdtempSync(join(tmpdir(), "barrel-exports-"));
  dirs.push(dir);
  for (const [name, source] of Object.entries(files)) {
    writeFileSync(join(dir, name), source);
  }
  return join(dir, "index.ts");
};

afterAll(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
});

describe("barrelExports", () => {
  it("lists values and types from export lists, with `type` and `as`", () => {
    const index = fixture({
      "index.ts": [
        `export { a, b as c, type D, type E as F } from "./x";`,
        `export type { G, H as I } from "./x";`,
        `const j = 1;`,
        `export { j };`,
      ].join("\n"),
    });
    expect(barrelExports(index)).toEqual(
      ["D", "F", "G", "I", "a", "c", "j"].sort(),
    );
  });

  it("lists declarations, namespace re-exports and a default", () => {
    const index = fixture({
      "index.ts": [
        `export const a = 1;`,
        `export function b() {}`,
        `export type C = string;`,
        `export interface D {}`,
        `export declare const E: number;`,
        `export * as ns from "./x";`,
        `export default a;`,
      ].join("\n"),
    });
    expect(barrelExports(index)).toEqual(
      ["C", "D", "E", "a", "b", "default", "ns"].sort(),
    );
  });

  it("follows `export *`, reading a .js module through its .d.ts", () => {
    const index = fixture({
      "index.ts": `export * from "./values";\nexport * from "./types";`,
      "values.js": `export { default as A } from "x";`,
      "values.d.ts": `export declare const A: number;`,
      "types.ts": `export type B = string;`,
    });
    expect(barrelExports(index)).toEqual(["A", "B"]);
  });

  it("ignores comments but not strings that look like them", () => {
    const index = fixture({
      "index.ts": [
        `// export { commented } from "./x";`,
        `/* export const alsoCommented = 1; */`,
        `export { kept } from "lib//path";`,
      ].join("\n"),
    });
    expect(barrelExports(index)).toEqual(["kept"]);
  });

  it("refuses to guess at `export *` from a package", () => {
    const index = fixture({ "index.ts": `export * from "some-package";` });
    expect(() => barrelExports(index)).toThrow(/cannot follow/);
  });
});
