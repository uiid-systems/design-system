#!/usr/bin/env node

/**
 * Theme Generator (wrapper)
 *
 * Delegates to @uiid/themes generator, providing the TokenGenerator
 * from this repo as the registry implementation.
 *
 * Usage:
 *   npx tsx scripts/generate-theme.js --input <theme.json> --output <theme.css>
 *   npx tsx scripts/generate-theme.js --input <theme.json> --dry-run
 */

import path from "path";
import { fileURLToPath } from "url";
import TokenGenerator from "./generate-tokens.js";
import { generateTheme as _generateTheme } from "../packages/themes/src/generator/generate-theme.ts";

function createRegistry() {
  return new TokenGenerator({ force: true });
}

export async function generateTheme(inputPath, outputPath, options = {}) {
  return _generateTheme(inputPath, outputPath, createRegistry, options);
}

// --- CLI ---

function parseArgs(argv) {
  const args = { input: null, output: null, dryRun: false };

  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === "--input" || argv[i] === "-i") && argv[i + 1]) {
      args.input = argv[++i];
    } else if ((argv[i] === "--output" || argv[i] === "-o") && argv[i + 1]) {
      args.output = argv[++i];
    } else if (argv[i] === "--dry-run") {
      args.dryRun = true;
    }
  }

  return args;
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const args = parseArgs(process.argv.slice(2));

  if (!args.input) {
    console.error("Usage: npx tsx scripts/generate-theme.js --input <theme.json> [options]");
    console.error("  -i, --input    Path to theme JSON file");
    console.error("  -o, --output   Path for generated CSS (default: <name>.theme.css)");
    console.error("  --dry-run      Validate and print stats without writing CSS");
    process.exit(1);
  }

  const inputPath = path.resolve(args.input);
  const outputPath = args.output
    ? path.resolve(args.output)
    : inputPath.replace(/\.theme\.json$/, ".theme.css").replace(/\.json$/, ".theme.css");

  generateTheme(inputPath, outputPath, { dryRun: args.dryRun }).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
