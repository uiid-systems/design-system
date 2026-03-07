/**
 * CLI: Convert a VSCode theme JSON/JSONC file to a UIID theme input JSON.
 *
 * Usage:
 *   npx tsx scripts/convert-vscode-theme.js --input <vscode-theme.json> [--output <uiid-theme.json>] [--name "My Theme"]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { convertVscodeTheme } from "../packages/themes/src/vscode/index.ts";

const args = process.argv.slice(2);

function flag(name) {
  const idx = args.indexOf(`--${name}`) !== -1
    ? args.indexOf(`--${name}`)
    : args.indexOf(`-${name[0]}`);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

const inputPath = flag("input") ?? flag("i");
const outputPath = flag("output") ?? flag("o");
const nameOverride = flag("name");

if (!inputPath) {
  console.error("Usage: npx tsx scripts/convert-vscode-theme.js --input <vscode-theme.json> [--output <uiid-theme.json>] [--name \"Theme Name\"]");
  process.exit(1);
}

const resolvedInput = resolve(inputPath);
const raw = readFileSync(resolvedInput, "utf-8");

const { theme, warnings } = convertVscodeTheme(raw, {
  name: nameOverride,
});

if (warnings.length > 0) {
  console.log("\n⚠ Warnings:");
  for (const w of warnings) {
    console.log(`  - ${w}`);
  }
  console.log();
}

const json = JSON.stringify(theme, null, 2);

if (outputPath) {
  const resolvedOutput = resolve(outputPath);
  writeFileSync(resolvedOutput, json + "\n", "utf-8");
  console.log(`✓ Wrote UIID theme to ${resolvedOutput}`);
} else {
  console.log(json);
}
