#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRIMITIVES_DIR = join(__dirname, "../packages/tokens/src/primitives");
const COMPONENTS_DIR = join(__dirname, "../packages/tokens/src/components");
const OUTPUT_DIR = join(__dirname, "../packages/tokens/src/styles");

/**
 * Recursively flatten a nested object into CSS custom properties
 * @param {Object} obj - The object to flatten
 * @param {string} prefix - The prefix for the CSS variable name
 * @returns {Object} - Flattened object with CSS variable names as keys
 */
function flattenTokens(obj, prefix = "") {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === "object") {
      // Check if this is a token with $value or value property
      if (value.$value !== undefined || value.value !== undefined) {
        const tokenValue = value.$value || value.value;
        // Handle references to other tokens
        if (
          typeof tokenValue === "string" &&
          tokenValue.startsWith("{") &&
          tokenValue.endsWith("}")
        ) {
          const reference = tokenValue.slice(1, -1).replace(/\./g, "-");
          result[newKey] = `var(--${reference})`;
        } else {
          result[newKey] = tokenValue;
        }
      } else if (value.$type || value.type) {
        // Skip type definitions
        continue;
      } else {
        // Recursively flatten nested objects
        Object.assign(result, flattenTokens(value, newKey));
      }
    }
  }

  return result;
}

/**
 * Generate CSS header comment
 * @param {string} sourceFile - Source JSON file path
 * @returns {string} - CSS header comment
 */
function generateHeader(sourceFile) {
  return `/*
 * This file is auto-generated from design tokens.
 * Do not edit directly - changes will be overwritten.
 * Generated from: ${sourceFile}
 */

`;
}

/**
 * Generate CSS content from flattened tokens
 * @param {Object} tokens - Flattened tokens object
 * @param {string} category - Token category (colors, typography, etc.)
 * @param {string} sourceFile - Source JSON file path
 * @returns {string} - CSS content
 */
function generateCSS(tokens, category, sourceFile) {
  const header = generateHeader(sourceFile);
  const cssVars = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  return `${header}:root {\n${cssVars}\n}\n`;
}

/**
 * Main function to build all tokens
 */
async function buildTokens() {
  try {
    console.log("🚀 Building design tokens...");

    // Ensure output directories exist
    await mkdir(join(OUTPUT_DIR, "primitives"), { recursive: true });
    await mkdir(join(OUTPUT_DIR, "components"), { recursive: true });

    // Generate colors CSS (single file)
    console.log("📝 Generating color tokens...");
    const colorsContent = await readFile(
      join(PRIMITIVES_DIR, "colors.json"),
      "utf-8",
    );
    const colors = JSON.parse(colorsContent);
    const flattened = flattenTokens(colors.colors || colors);
    const colorsCSS = generateCSS(
      flattened,
      "colors",
      "src/primitives/colors.json",
    );
    await writeFile(join(OUTPUT_DIR, "primitives", "colors.css"), colorsCSS);
    console.log("   ✅ Generated primitives/colors.css");

    // Generate typography CSS
    console.log("📝 Generating typography tokens...");
    const typographyContent = await readFile(
      join(PRIMITIVES_DIR, "typography.json"),
      "utf-8",
    );
    const typography = JSON.parse(typographyContent);
    const typographyFlattened = flattenTokens(
      typography.typography || typography,
    );
    const typographyCSS = generateCSS(
      typographyFlattened,
      "typography",
      "src/primitives/typography.json",
    );
    await writeFile(
      join(OUTPUT_DIR, "primitives", "typography.css"),
      typographyCSS,
    );
    console.log("   ✅ Generated primitives/typography.css");

    // Generate spacing CSS
    console.log("📝 Generating spacing tokens...");
    const spacingContent = await readFile(
      join(PRIMITIVES_DIR, "spacing.json"),
      "utf-8",
    );
    const spacing = JSON.parse(spacingContent);
    const spacingFlattened = flattenTokens(spacing.spacing || spacing);
    const spacingCSS = generateCSS(
      spacingFlattened,
      "spacing",
      "src/primitives/spacing.json",
    );
    await writeFile(join(OUTPUT_DIR, "primitives", "spacing.css"), spacingCSS);
    console.log("   ✅ Generated primitives/spacing.css");

    // Generate component CSS files
    console.log("📝 Generating component tokens...");
    const componentFiles = ["button.json", "input.json"];

    for (const file of componentFiles) {
      try {
        const componentContent = await readFile(
          join(COMPONENTS_DIR, file),
          "utf-8",
        );
        const component = JSON.parse(componentContent);
        const componentFlattened = flattenTokens(component);
        const componentCSS = generateCSS(
          componentFlattened,
          file.replace(".json", ""),
          `src/components/${file}`,
        );
        const outputFile = file.replace(".json", ".css");
        await writeFile(
          join(OUTPUT_DIR, "components", outputFile),
          componentCSS,
        );
        console.log(`   ✅ Generated components/${outputFile}`);
      } catch (error) {
        console.log(`   ⚠️  Skipped ${file} (not found)`);
      }
    }

    // Generate barrel index files
    console.log("📝 Generating barrel index files...");
    
    // Generate primitives/index.css
    const primitivesIndexCSS =
      generateHeader("Primitives barrel export") +
      `@import "./colors.css";\n` +
      `@import "./typography.css";\n` +
      `@import "./spacing.css";\n`;
    await writeFile(join(OUTPUT_DIR, "primitives", "index.css"), primitivesIndexCSS);
    console.log("   ✅ Generated primitives/index.css");
    
    // Generate components/index.css
    const componentsIndexCSS =
      generateHeader("Components barrel export") +
      `@import "./button.css";\n` +
      `@import "./input.css";\n`;
    await writeFile(join(OUTPUT_DIR, "components", "index.css"), componentsIndexCSS);
    console.log("   ✅ Generated components/index.css");

    // Generate main index.css
    console.log("📝 Generating main index.css...");
    const indexCSS =
      generateHeader("Generated index file") +
      `@import "./primitives/index.css";\n` +
      `@import "./components/index.css";\n`;
    await writeFile(join(OUTPUT_DIR, "index.css"), indexCSS);
    console.log("   ✅ Generated index.css");

    console.log("✨ Token build complete!");
  } catch (error) {
    console.error("❌ Error building tokens:", error);
    process.exit(1);
  }
}

// Run the build if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildTokens();
}

export { buildTokens, flattenTokens, generateCSS };
