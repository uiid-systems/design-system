#!/usr/bin/env node

/**
 * Theme Generator
 *
 * Reads a user-supplied theme JSON file, validates it against ThemeInputSchema,
 * and produces a CSS override file with pre-computed light-dark() values for
 * all shade and tone tokens that transitively depend on theme colors.
 *
 * Usage:
 *   node scripts/generate-theme.js --input <theme.json> --output <theme.css>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { computeColorMix } from "../packages/tokens/transforms/color-utils.js";
import TokenGenerator from "./generate-tokens.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Schema validation (lightweight, no TS compile needed) ---

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

const THEME_DEFAULTS = {
  positive: "#00c565",
  warning: "#e8b700",
  critical: "#f9262a",
  info: "#347eff",
};

function validateThemeInput(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { success: false, errors: ["Input must be a JSON object"] };
  }

  // Required string
  if (!data.name || typeof data.name !== "string") {
    errors.push("'name' is required and must be a non-empty string");
  }

  // Required hex colors
  for (const field of ["white", "black", "primary", "secondary"]) {
    if (!data[field] || !HEX_RE.test(data[field])) {
      errors.push(`'${field}' is required and must be a 6-digit hex color`);
    }
  }

  // Optional hex colors
  for (const field of ["positive", "warning", "critical", "info"]) {
    if (data[field] !== undefined && !HEX_RE.test(data[field])) {
      errors.push(`'${field}' must be a 6-digit hex color if provided`);
    }
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data };
}

// --- CLI argument parsing ---

function parseArgs(argv) {
  const args = { input: null, output: null };

  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === "--input" || argv[i] === "-i") && argv[i + 1]) {
      args.input = argv[++i];
    } else if ((argv[i] === "--output" || argv[i] === "-o") && argv[i + 1]) {
      args.output = argv[++i];
    }
  }

  return args;
}

// --- Theme token mapping ---

// These are the 8 theme tokens and their backing color primitives.
// The overrides map sets both the theme token and its color.* source
// so that any token referencing either path gets the user-supplied value.
function buildOverrides(theme) {
  const overrides = new Map();

  // White/black → affects shade.background and shade.foreground via light-dark
  overrides.set("color.white", theme.white);
  overrides.set("color.black", theme.black);
  overrides.set("theme.white", theme.white);
  overrides.set("theme.black", theme.black);

  // Brand colors
  overrides.set("theme.primary", theme.primary);
  overrides.set("theme.secondary", theme.secondary);

  // Tone colors (with defaults)
  const positive = theme.positive ?? THEME_DEFAULTS.positive;
  const warning = theme.warning ?? THEME_DEFAULTS.warning;
  const critical = theme.critical ?? THEME_DEFAULTS.critical;
  const info = theme.info ?? THEME_DEFAULTS.info;

  overrides.set("theme.positive", positive);
  overrides.set("theme.warning", warning);
  overrides.set("theme.critical", critical);
  overrides.set("theme.info", info);

  // Also set tone.* base values since they alias theme.*
  overrides.set("tone.positive", positive);
  overrides.set("tone.warning", warning);
  overrides.set("tone.critical", critical);
  overrides.set("tone.info", info);

  return overrides;
}

// --- Tokens that need re-derivation ---

// Collect all registry entries with org.uiid.derive that transitively depend
// on any overridden token path. Returns a Map of cssVarName → cssValue.
function collectDerivedOverrides(generator, overriddenPaths) {
  const result = new Map();

  for (const [tokenPath, token] of generator.registry) {
    const derive = token.$extensions?.["org.uiid.derive"];
    if (!derive) continue;

    // Check if this token depends on any overridden path
    if (!dependsOnOverrides(generator, tokenPath, overriddenPaths, new Set())) {
      continue;
    }

    const cssVar = `--${tokenPath.replace(/\./g, "-")}`;

    try {
      if (derive.method === "mix") {
        const pair1 = generator.resolveToHexPair(derive.color1);
        const pair2 = generator.resolveToHexPair(derive.color2);
        const lightHex = computeColorMix(pair1.light, pair2.light, 1 - derive.ratio);
        const darkHex = computeColorMix(pair1.dark, pair2.dark, 1 - derive.ratio);
        result.set(cssVar, `light-dark(${lightHex}, ${darkHex})`);
      } else if (derive.method === "light-dark") {
        const lightPair = generator.resolveToHexPair(derive.light);
        const darkPair = generator.resolveToHexPair(derive.dark);
        result.set(cssVar, `light-dark(${lightPair.light}, ${darkPair.dark})`);
      }
    } catch (err) {
      console.warn(`  ⚠️  Could not resolve ${tokenPath}: ${err.message}`);
    }
  }

  return result;
}

// Recursively check if a token depends on any overridden path.
function dependsOnOverrides(generator, tokenPath, overriddenPaths, visited) {
  if (overriddenPaths.has(tokenPath)) return true;
  if (visited.has(tokenPath)) return false;

  visited.add(tokenPath);

  const token = generator.registry.get(tokenPath);
  if (!token) return false;

  const derive = token.$extensions?.["org.uiid.derive"];
  if (derive) {
    const refs = [];
    if (derive.light) refs.push(derive.light);
    if (derive.dark) refs.push(derive.dark);
    if (derive.color1) refs.push(derive.color1);
    if (derive.color2) refs.push(derive.color2);

    for (const ref of refs) {
      if (typeof ref === "string" && ref.startsWith("{") && ref.endsWith("}")) {
        const refPath = ref.slice(1, -1);
        if (dependsOnOverrides(generator, refPath, overriddenPaths, visited)) {
          return true;
        }
      }
    }
  }

  // Also check plain $value references
  const value = token.$value;
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    const refPath = value.slice(1, -1);
    if (dependsOnOverrides(generator, refPath, overriddenPaths, visited)) {
      return true;
    }
  }

  return false;
}

// --- CSS output ---

function generateCss(themeName, directOverrides, derivedOverrides) {
  const timestamp = new Date().toISOString();
  const lines = [];

  lines.push(`/**`);
  lines.push(` * ${themeName} Theme Override`);
  lines.push(` *`);
  lines.push(` * Generated by: scripts/generate-theme.js`);
  lines.push(` * Generated on: ${timestamp}`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`:root {`);

  // Direct theme token overrides
  lines.push(`  /* Theme tokens */`);
  for (const [cssVar, value] of directOverrides) {
    lines.push(`  ${cssVar}: ${value};`);
  }

  // Derived shade/tone overrides
  if (derivedOverrides.size > 0) {
    lines.push(``);
    lines.push(`  /* Derived shade + tone tokens */`);
    for (const [cssVar, value] of derivedOverrides) {
      lines.push(`  ${cssVar}: ${value};`);
    }
  }

  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
}

// --- Main ---

export async function generateTheme(inputPath, outputPath) {
  // 1. Read and validate input
  const raw = fs.readFileSync(inputPath, "utf8");
  const parsed = JSON.parse(raw);
  const validation = validateThemeInput(parsed);

  if (!validation.success) {
    throw new Error(
      `Invalid theme input:\n  ${validation.errors.join("\n  ")}`
    );
  }

  const theme = parsed;

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

  // 7. Write output
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, css, "utf8");

  console.log(`✅ Theme "${theme.name}" generated → ${outputPath}`);
  console.log(`   ${directOverrides.size} direct overrides, ${derivedOverrides.size} derived tokens`);

  return { directOverrides, derivedOverrides, css };
}

// Execute if run directly
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const args = parseArgs(process.argv.slice(2));

  if (!args.input) {
    console.error("Usage: generate-theme.js --input <theme.json> --output <theme.css>");
    console.error("  -i, --input   Path to theme JSON file");
    console.error("  -o, --output  Path for generated CSS (default: <name>.theme.css)");
    process.exit(1);
  }

  const inputPath = path.resolve(args.input);

  // Default output: same directory, same name with .theme.css extension
  const outputPath = args.output
    ? path.resolve(args.output)
    : inputPath.replace(/\.theme\.json$/, ".theme.css").replace(/\.json$/, ".theme.css");

  generateTheme(inputPath, outputPath).catch((err) => {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  });
}
