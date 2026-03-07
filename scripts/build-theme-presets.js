#!/usr/bin/env node

/**
 * Build Theme Presets
 *
 * Generates CSS override files for all theme presets in @uiid/themes.
 * Output goes to packages/themes/src/presets/css/.
 *
 * Usage:
 *   npx tsx scripts/build-theme-presets.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateTheme } from "./generate-theme.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRESETS_DIR = path.join(ROOT, "packages/themes/src/presets");
const OUTPUT_DIR = path.join(PRESETS_DIR, "css");

async function buildPresets() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Find all .theme.json files in presets directory
  const files = fs.readdirSync(PRESETS_DIR).filter((f) => f.endsWith(".theme.json"));

  if (files.length === 0) {
    console.log("No preset files found.");
    return;
  }

  console.log(`Building ${files.length} theme preset(s)...\n`);

  for (const file of files) {
    const inputPath = path.join(PRESETS_DIR, file);
    const outputFile = file.replace(/\.theme\.json$/, ".theme.css");
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    try {
      await generateTheme(inputPath, outputPath);
      console.log("");
    } catch (err) {
      console.error(`  Failed to build ${file}: ${err.message}\n`);
    }
  }

  console.log("Done.");
}

buildPresets().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
