#!/usr/bin/env node

/**
 * Writes `@uiid/tokens/src/props.css` from the style props in `src/props`.
 * With `--check`, writes nothing and exits 1 if the file is out of date.
 *
 * `runnerImport` loads the TypeScript source directly, so no build is needed.
 */

import fs from "node:fs";
import path from "node:path";

import { runnerImport } from "vite";

const ROOT = path.resolve(import.meta.dirname, "..");
const TARGET = path.resolve(ROOT, "../tokens/src/props.css");

const { module } = await runnerImport("./src/props/css.ts", {
  configFile: false,
  root: ROOT,
  logLevel: "silent",
});

const css = module.stylePropsCss();
const relative = path.relative(process.cwd(), TARGET);

if (process.argv.includes("--check")) {
  const current = fs.existsSync(TARGET) ? fs.readFileSync(TARGET, "utf8") : "";

  if (current !== css) {
    console.error(`${relative} is out of date. Run \`pnpm generate:props\`.`);
    process.exit(1);
  }

  console.log(`${relative} is up to date.`);
} else {
  fs.writeFileSync(TARGET, css);
  console.log(`Wrote ${relative}.`);
}
