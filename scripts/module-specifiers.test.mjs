// @vitest-environment node
import { moduleSpecifiers } from "./module-specifiers.mjs";

const names = (text) => moduleSpecifiers(text).map((found) => found.specifier);

describe("moduleSpecifiers", () => {
  it("finds static imports, re-exports and side-effect imports", () => {
    const text = [
      `import a from "./a";`,
      `import * as b from "./b";`,
      `import c, { d } from "./c";`,
      `import "./side-effect";`,
      `export { e } from "./e";`,
      `export * from "./f";`,
      `export * as g from "./g";`,
    ].join("\n");
    expect(names(text)).toEqual([
      "./a",
      "./b",
      "./c",
      "./side-effect",
      "./e",
      "./f",
      "./g",
    ]);
  });

  it("finds type-only imports and exports", () => {
    const text = [
      `import type { A } from "./a";`,
      `import { type B } from "./b";`,
      `export type { C } from "./c";`,
      `export type * from "./d";`,
    ].join("\n");
    expect(names(text)).toEqual(["./a", "./b", "./c", "./d"]);
  });

  it("finds specifiers spread over several lines and in single quotes", () => {
    const text = `import {\n  a,\n  b,\n} from\n  './multi';`;
    expect(names(text)).toEqual(["./multi"]);
  });

  it("finds dynamic imports, import types and require calls", () => {
    const text = [
      `const lazy = () => import("./lazy");`,
      `type T = typeof import("./types").default;`,
      `let x: import("./inline").X;`,
      `const r = require("./cjs");`,
      `import e = require("./equals");`,
    ].join("\n");
    expect(names(text)).toEqual([
      "./lazy",
      "./types",
      "./inline",
      "./cjs",
      "./equals",
    ]);
  });

  it("finds ambient module declarations and augmentations", () => {
    expect(names(`declare module "./augmented" {}\nexport {};`)).toEqual([
      "./augmented",
    ]);
    expect(names(`declare module "*.css" {}`)).toEqual(["*.css"]);
  });

  it("finds imports inside a declare module block", () => {
    const text = `declare module "pkg" {\n  import x from "./inner";\n}`;
    expect(names(text)).toEqual(["pkg", "./inner"]);
  });

  it("keeps import attributes out of the specifier", () => {
    expect(names(`import j from "./data.json" with { type: "json" };`)).toEqual(
      ["./data.json"],
    );
  });

  it("ignores specifiers in comments", () => {
    const text = [
      `// import a from "./line-comment";`,
      `/* import("./block-comment") */`,
      `/**`,
      ` * @example`,
      ` * import { b } from "./jsdoc";`,
      ` */`,
      `import real from "./real";`,
    ].join("\n");
    expect(names(text)).toEqual(["./real"]);
  });

  it("ignores import-like text in strings and templates", () => {
    const text = [
      `const s = "import a from './in-string'";`,
      `const t = 'export * from "./in-single"';`,
      'const u = `import b from "./in-template"`;',
      "const v = `${'x'} from \"./after-expression\"`;",
      `const w = "from" + "./not-a-specifier";`,
    ].join("\n");
    expect(names(text)).toEqual([]);
  });

  it("finds an import inside a template expression", () => {
    expect(names('const t = `${await import("./inside")}`;')).toEqual([
      "./inside",
    ]);
  });

  it("ignores import-like text in regular expressions", () => {
    const text = [
      `const a = /import\\("\\.\\/regex"\\)/;`,
      `const b = /from "[./]class"/g.test(x);`,
      `const c = (n) => n / 2 / import("./after-division");`,
    ].join("\n");
    expect(names(text)).toEqual(["./after-division"]);
  });

  it("ignores import.meta and member calls named like keywords", () => {
    const text = `const u = import.meta.url;\nconst m = foo.import("./member");`;
    expect(names(text)).toEqual([]);
  });

  it("returns the position of the text inside the quotes", () => {
    const text = `import a from "./a";\nexport * from './b';`;
    for (const { specifier, start, end } of moduleSpecifiers(text)) {
      expect(text.slice(start, end)).toBe(specifier);
      expect(`"'`).toContain(text[start - 1]);
      expect(text[end]).toBe(text[start - 1]);
    }
  });

  it("returns an escaped specifier as written", () => {
    expect(names(`import a from "./e\\u0073c";`)).toEqual(["./e\\u0073c"]);
  });

  it("ends an unterminated regex at the line end, not on the next line", () => {
    // `</p>` reads as the start of a regex that never closes.
    const text = `const A = () => <p>hi</p>\nimport("./lazy");`;
    expect(names(text)).toEqual(["./lazy"]);
  });

  it("skips a hashbang line", () => {
    expect(names(`#!/usr/bin/env node\nimport "./hb";`)).toEqual(["./hb"]);
    // Read as code, the backtick would open a template over the next line.
    expect(names("#!node --title=`x\nimport './hb2';")).toEqual(["./hb2"]);
  });

  it("finds a template specifier with no substitution", () => {
    const text = "const a = import(`./tpl`);\nconst b = import(`./${name}`);";
    expect(names(text)).toEqual(["./tpl"]);
    const [{ start, end }] = moduleSpecifiers(text);
    expect(text.slice(start - 1, end + 1)).toBe("`./tpl`");
  });

  it("reads a keyword used as a property name as the end of an expression", () => {
    expect(names(`obj.in / 2; import("./x"); 3 / 4`)).toEqual(["./x"]);
  });

  it("reads a slash after a closing bracket as division", () => {
    expect(names(`f(x) / 2; s = "/"; import("./y")`)).toEqual(["./y"]);
  });

  it("reads a slash after return as a regex", () => {
    const text = `function f(s) { return /"/.test(s) } import "./after";`;
    expect(names(text)).toEqual(["./after"]);
  });

  it("continues a string over a backslash and CRLF", () => {
    const text = `const s = "a\\\r\nimport 'x'"; import "./real";`;
    expect(names(text)).toEqual(["./real"]);
  });

  it("reads a slash after a template literal as division", () => {
    const text = 'const h = `${n}` / 2; import("./x"); 1 / 2;';
    expect(names(text)).toEqual(["./x"]);
  });

  it("skips escaped quotes inside a string", () => {
    expect(names(`const s = "a\\"b import 'x'";`)).toEqual([]);
  });

  it("ends a string opened by a quote in JSX text at the line end", () => {
    const text = `const A = () => <p>Don't</p>;\nimport "./next-line";`;
    expect(names(text)).toEqual(["./next-line"]);
  });

  it("treats U+2028 and U+2029 as line ends", () => {
    expect(names(`const s = "open import "./after-ls";`)).toEqual([
      "./after-ls",
    ]);
    expect(names(`// note import "./after-ps";`)).toEqual(["./after-ps"]);
  });

  it("ignores optional member calls named import or require", () => {
    const text = `a?.import("./optional");\nb?.require("./optional-cjs");`;
    expect(names(text)).toEqual([]);
  });

  // Known false positive, shared with `ts.preProcessFile`: JSX text is code.
  it("reads import-like JSX text as an import", () => {
    expect(names(`<p>import from "./jsx-text"</p>`)).toEqual(["./jsx-text"]);
  });
});
