// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { barrelExports } from "./barrel-exports.mjs";

const dirs = [];
const fixture = (files, entry = "index.ts") => {
  const dir = mkdtempSync(join(tmpdir(), "barrel-exports-"));
  dirs.push(dir);
  for (const [name, source] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), source);
  }
  return join(dir, entry);
};
const exportsOf = (source, entry = "index.ts") =>
  barrelExports(fixture({ [entry]: source }, entry));

afterAll(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
});

describe("barrelExports", () => {
  it("lists values and types from export lists, with `type` and `as`", () => {
    const source = [
      `export { a, b as c, type D, type E as F } from "./x";`,
      `export type { G, H as I } from "./x";`,
      `const j = 1;`,
      `export { j, j as "string name" };`,
    ].join("\n");
    expect(exportsOf(source)).toEqual(
      ["D", "F", "G", "I", "a", "c", "j", "string name"].sort(),
    );
  });

  it("reads a multi-line list with comments inside it", () => {
    const source = [
      `export {`,
      `  a, // a note`,
      `  /* b, */`,
      `  type C,`,
      `} from "./x";`,
    ].join("\n");
    expect(exportsOf(source)).toEqual(["C", "a"]);
  });

  it("lists every declarator, destructured ones included", () => {
    const source = [
      `declare const o: any;`,
      `export const a = 1, b = 2;`,
      `export const { c, d: e, ...f } = o;`,
      `export const [g, , ...h] = o;`,
    ].join("\n");
    expect(exportsOf(source)).toEqual(["a", "b", "c", "e", "f", "g", "h"]);
  });

  it("lists declarations, const enums, namespaces and a default", () => {
    const source = [
      `export function a() {}`,
      `export function* b() {}`,
      `export class C {}`,
      `export type D = string;`,
      `export interface E {}`,
      `export const enum F { X }`,
      `export namespace G {}`,
      `export declare namespace H {}`,
      `export default a;`,
    ].join("\n");
    expect(exportsOf(source)).toEqual(
      ["C", "D", "E", "F", "G", "H", "a", "b", "default"].sort(),
    );
  });

  it("reads declaration files", () => {
    const source = [
      `export declare const A: number;`,
      `export declare function b(): void;`,
    ].join("\n");
    expect(exportsOf(source, "index.d.ts")).toEqual(["A", "b"]);
  });

  it("lists `export * as` and `export type * as` under their names", () => {
    const source = [
      `export * as ns from "./x";`,
      `export type * as types from "./x";`,
    ].join("\n");
    expect(exportsOf(source)).toEqual(["ns", "types"]);
  });

  it("follows `export *` and `export type *`, but never re-exports default", () => {
    const index = fixture({
      "index.ts": [
        `export * from "./values";`,
        `export type * from "./types";`,
        `export * from "./dir";`,
      ].join("\n"),
      "values.js": `export { default as A } from "x";`,
      "values.d.ts": `export declare const A: number;\nexport default A;`,
      "types.ts": `export type B = string;`,
      "dir/index.ts": `export const c = 1;`,
    });
    expect(barrelExports(index)).toEqual(["A", "B", "c"]);
  });

  it("survives a re-export cycle", () => {
    const index = fixture({
      "index.ts": `export * from "./a";`,
      "a.ts": `export * from "./b";\nexport const a = 1;`,
      "b.ts": `export * from "./a";\nexport const b = 1;`,
    });
    expect(barrelExports(index)).toEqual(["a", "b"]);
  });

  it("does not report export-like text in strings, templates or nested scopes", () => {
    const source = [
      `const s = "export const fake = 1";`,
      "const t = `http://x ${s}`; export const kept = 1;",
      `declare global { export interface Window {} }`,
      `export {};`,
    ].join("\n");
    expect(exportsOf(source)).toEqual(["kept"]);
  });

  it.each([
    [`export * from "some-package";`, /export \* from "some-package"/],
    [`declare namespace N {}\nexport = N;`, /TSExportAssignment/],
    [`export as namespace Lib;`, /TSNamespaceExportDeclaration/],
    [
      `declare namespace N { const Y: 1 }\nexport import Y = N.Y;`,
      /TSImportEqualsDeclaration|export import/,
    ],
    [`export declare module "x" {}`, /declare module "x"/],
    [`export const = ;`, /cannot parse/],
  ])("throws on what it does not handle: %s", (source, message) => {
    expect(() => exportsOf(source)).toThrow(message);
  });
});
