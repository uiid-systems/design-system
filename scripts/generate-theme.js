#!/usr/bin/env node

/**
 * Theme Generator
 *
 * Reads a user-supplied theme JSON file, validates it against ThemeInputSchema,
 * and produces a CSS override file with pre-computed light-dark() values for
 * all shade and tone tokens that transitively depend on theme colors.
 *
 * Usage:
 *   npx tsx scripts/generate-theme.js --input <theme.json> --output <theme.css>
 *   npx tsx scripts/generate-theme.js --input <theme.json> --dry-run
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import TokenGenerator from "./generate-tokens.js";
import {
  ThemeInputSchema,
  THEME_DEFAULTS,
} from "../packages/tokens/src/schema/theme-input.ts";
import { buildOverrides, collectDerivedOverrides } from "./theme/overrides.js";
import { generateCss } from "./theme/css.js";

// --- CLI argument parsing ---

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

// --- Main ---

export async function generateTheme(inputPath, outputPath, options = {}) {
  const { dryRun = false } = options;

  // 1. Read and validate input
  const raw = fs.readFileSync(inputPath, "utf8");
  const parsed = JSON.parse(raw);
  const result = ThemeInputSchema.safeParse(parsed);

  if (!result.success) {
    const messages = result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`
    );
    throw new Error(`Invalid theme input:\n  ${messages.join("\n  ")}`);
  }

  const theme = result.data;

  // 2. Build token registry from default JSON files
  const generator = new TokenGenerator({ force: true });
  const jsonFiles = generator.discoverJsonFiles(generator.jsonDir);
  generator.buildRegistry(jsonFiles);

  // 3. Build overrides and apply them
  const overrides = buildOverrides(theme);
  const overriddenPaths = new Set(overrides.keys());

  // Apply overrides so resolveToHexPair uses user values
  generator.applyOverrides(overrides);

  // 4. Collect direct CSS overrides for theme tokens
  const directOverrides = new Map();
  directOverrides.set("--theme-white", theme.white);
  directOverrides.set("--theme-black", theme.black);
  directOverrides.set("--theme-primary", theme.primary);
  directOverrides.set("--theme-secondary", theme.secondary);
  directOverrides.set("--theme-positive", theme.positive ?? THEME_DEFAULTS.positive);
  directOverrides.set("--theme-warning", theme.warning ?? THEME_DEFAULTS.warning);
  directOverrides.set("--theme-critical", theme.critical ?? THEME_DEFAULTS.critical);
  directOverrides.set("--theme-info", theme.info ?? THEME_DEFAULTS.info);

  // 5. Re-derive all tokens that transitively depend on overridden values
  const derivedOverrides = collectDerivedOverrides(generator, overriddenPaths);

  // 6. Generate CSS
  const css = generateCss(theme.name, directOverrides, derivedOverrides);

  // 7. Write output (unless dry-run)
  if (!dryRun) {
    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, css, "utf8");
  }

  const label = dryRun ? "(dry run)" : `→ ${outputPath}`;
  console.log(`Theme "${theme.name}" ${label}`);
  console.log(`  ${directOverrides.size} direct overrides, ${derivedOverrides.size} derived tokens`);

  return { directOverrides, derivedOverrides, css };
}

// Execute if run directly
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

  // Default output: same directory, same name with .theme.css extension
  const outputPath = args.output
    ? path.resolve(args.output)
    : inputPath.replace(/\.theme\.json$/, ".theme.css").replace(/\.json$/, ".theme.css");

  generateTheme(inputPath, outputPath, { dryRun: args.dryRun }).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
