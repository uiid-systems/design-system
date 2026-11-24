// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { rewriteDeclarationsIn } from "./dts-relative-extensions.mjs";

// Writes `files` under a fresh directory, rewrites it, and returns the result.
function rewritten(files) {
  const dir = mkdtempSync(join(tmpdir(), "dts-rewrite-"));
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), content);
  }
  rewriteDeclarationsIn(dir);
  return (name) => readFileSync(join(dir, name), "utf8");
}

const neighbours = {
  "button.d.ts": "export {};\n",
  "button/index.d.ts": "export {};\n",
  "colors.tokens.json.d.ts": "export {};\n",
  "nested/item.d.ts": "export {};\n",
};

describe("rewriteDeclarationsIn", () => {
  it("adds .js to a relative file and /index.js to a directory", () => {
    const read = rewritten({
      ...neighbours,
      "file.d.ts": `export * from "./nested/item";\n`,
      "dir.d.ts": `export * from "./button/";\n`,
    });
    expect(read("file.d.ts")).toBe(`export * from "./nested/item.js";\n`);
    expect(read("dir.d.ts")).toBe(`export * from "./button/index.js";\n`);
  });

  it("rewrites every kind of import a declaration can carry", () => {
    const read = rewritten({
      ...neighbours,
      "nested/index.d.ts": [
        `import { a } from "../button";`,
        `import type { B } from '../nested/item';`,
        `export { c } from "./item";`,
        `export * as d from "./item";`,
        `import "./item";`,
        `export type E = import("../colors.tokens.json").E;`,
        `declare module "./item" {}`,
        "",
      ].join("\n"),
    });
    expect(read("nested/index.d.ts")).toBe(
      [
        `import { a } from "../button.js";`,
        `import type { B } from '../nested/item.js';`,
        `export { c } from "./item.js";`,
        `export * as d from "./item.js";`,
        `import "./item.js";`,
        `export type E = import("../colors.tokens.json.js").E;`,
        `declare module "./item.js" {}`,
        "",
      ].join("\n"),
    );
  });

  it("leaves packages, named files and unresolved paths alone", () => {
    const content = [
      `import { a } from "react";`,
      `import { b } from "@uiid/utils";`,
      `import { c } from "./button.js";`,
      `import { d } from "./missing";`,
      "",
    ].join("\n");
    const read = rewritten({ ...neighbours, "index.d.ts": content });
    expect(read("index.d.ts")).toBe(content);
  });

  it("leaves specifiers in comments and strings alone", () => {
    const content = [
      `/**`,
      ` * @example`,
      ` * import { Button } from "./button";`,
      ` */`,
      `// export * from "./button";`,
      `export declare const code = "import x from './button'";`,
      `export type T = 'export * from "./button"';`,
      "",
    ].join("\n");
    const read = rewritten({ ...neighbours, "index.d.ts": content });
    expect(read("index.d.ts")).toBe(content);
  });

  it("drops a relative CSS side-effect import", () => {
    const read = rewritten({
      ...neighbours,
      "index.d.ts": `import "./globals.css";\nexport * from "./button";\n`,
    });
    expect(read("index.d.ts")).toBe(`export * from "./button.js";\n`);
  });

  it("touches only .d.ts files", () => {
    const content = `export * from "./button";\n`;
    const read = rewritten({ ...neighbours, "index.js": content });
    expect(read("index.js")).toBe(content);
  });
});
