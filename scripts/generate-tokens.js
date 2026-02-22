#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { computeColorMix } from "../packages/tokens/transforms/color-utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Token Generator Utility
 *
 * Automatically converts W3C Design Token JSON files to CSS custom properties
 * with proper layer scoping and auto-generated comments.
 *
 * Features:
 * - Discovers all JSON files in packages/tokens/src/json/
 * - Maintains directory taxonomy (json/primitives/colors.json → css/primitives/colors.css)
 * - Generates CSS with layer scoping
 * - Handles nested token structures
 * - Supports all W3C Design Token types
 * - Incremental builds (only processes changed files)
 * - Force mode with --force or -f flag
 */

class TokenGenerator {
  constructor(options = {}) {
    this.tokensRoot = path.resolve(__dirname, "../packages/tokens/src");
    this.jsonDir = path.join(this.tokensRoot, "json");
    this.cssDir = path.join(this.tokensRoot, "css");
    this.force = options.force || false;
    this.registry = new Map();
  }

  /**
   * Main execution function
   */
  async generate() {
    console.log("🎨 Generating CSS tokens from JSON...\n");

    try {
      // Ensure CSS directory exists
      this.ensureDirectoryExists(this.cssDir);

      // Discover all JSON token files
      const jsonFiles = this.discoverJsonFiles(this.jsonDir);

      if (jsonFiles.length === 0) {
        console.log("⚠️  No JSON token files found in", this.jsonDir);
        return;
      }

      // Build token registry for reference resolution
      this.buildRegistry(jsonFiles);

      // Process each JSON file and track results
      const results = [];
      for (const jsonFile of jsonFiles) {
        const result = await this.processTokenFile(jsonFile);
        results.push(result);
      }

      // Summary logging
      const processed = results.filter((r) => r?.processed).length;
      const skipped = results.filter((r) => r?.skipped).length;

      console.log(
        `\n✅ Token generation complete: ${processed} processed, ${skipped} skipped (${jsonFiles.length} total)`,
      );
    } catch (error) {
      console.error("❌ Error generating tokens:", error.message);
      process.exit(1);
    }
  }

  /**
   * Build a flat registry of all tokens for reference resolution.
   * Keyed by dot-path (e.g. "shade.background", "color.green").
   */
  buildRegistry(jsonFiles) {
    this.registry = new Map();
    for (const jsonFile of jsonFiles) {
      const jsonContent = fs.readFileSync(jsonFile.fullPath, "utf8");
      const tokens = JSON.parse(jsonContent);
      this._flattenTokens(tokens, "", this.registry);
    }
  }

  /**
   * Recursively flatten a token object into the registry map.
   */
  _flattenTokens(obj, prefix, map) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("$")) continue;
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (this.isTokenValue(value)) {
        map.set(fullKey, value);
      } else if (typeof value === "object" && value !== null) {
        this._flattenTokens(value, fullKey, map);
      }
    }
  }

  /**
   * Resolve a token reference or hex string to a { light, dark } hex pair.
   * Handles light-dark and mix derive methods recursively.
   *
   * @param {string} ref - A hex string "#rrggbb" or token ref "{a.b.c}"
   * @param {Set<string>} visited - Cycle detection set
   * @returns {{ light: string, dark: string }}
   */
  resolveToHexPair(ref, visited = new Set()) {
    if (typeof ref !== "string") {
      throw new Error(`Cannot resolve non-string ref: ${JSON.stringify(ref)}`);
    }

    // Static hex value — same in both modes
    if (ref.startsWith("#")) {
      return { light: ref, dark: ref };
    }

    // Token reference {a.b.c}
    if (ref.startsWith("{") && ref.endsWith("}")) {
      const tokenPath = ref.slice(1, -1);

      if (visited.has(tokenPath)) {
        throw new Error(`Circular token reference detected: ${tokenPath}`);
      }

      const newVisited = new Set(visited);
      newVisited.add(tokenPath);

      const token = this.registry.get(tokenPath);
      if (!token) {
        throw new Error(`Unknown token reference: ${tokenPath}`);
      }

      const derive = token.$extensions?.["org.uiid.derive"];

      // light-dark derive: light value for light mode, dark value for dark mode
      if (derive?.method === "light-dark") {
        const lightPair = this.resolveToHexPair(derive.light, newVisited);
        const darkPair = this.resolveToHexPair(derive.dark, newVisited);
        return { light: lightPair.light, dark: darkPair.dark };
      }

      // mix derive: compute color mix for each mode independently
      if (derive?.method === "mix") {
        const pair1 = this.resolveToHexPair(derive.color1, newVisited);
        const pair2 = this.resolveToHexPair(derive.color2, newVisited);
        const lightHex = computeColorMix(pair1.light, pair2.light, 1 - derive.ratio);
        const darkHex = computeColorMix(pair1.dark, pair2.dark, 1 - derive.ratio);
        return { light: lightHex, dark: darkHex };
      }

      // No derive — resolve the $value directly
      const value = token.$value;

      if (typeof value === "string") {
        if (value.startsWith("{") || value.startsWith("#")) {
          return this.resolveToHexPair(value, newVisited);
        }
      }

      // Structured color object (colorSpace + components + hex)
      if (typeof value === "object" && value !== null && value.hex) {
        return { light: value.hex, dark: value.hex };
      }

      throw new Error(`Cannot resolve token "${tokenPath}" to a hex pair`);
    }

    throw new Error(`Cannot resolve ref: ${ref}`);
  }

  /**
   * Recursively discover all JSON files in the tokens directory
   */
  discoverJsonFiles(dir, relativePath = "") {
    const files = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const currentRelativePath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        files.push(...this.discoverJsonFiles(fullPath, currentRelativePath));
      } else if (entry.isFile() && entry.name.endsWith(".tokens.json")) {
        files.push({
          fullPath,
          relativePath: currentRelativePath,
          name: path.parse(entry.name).name.replace(/\.tokens$/, ""),
        });
      }
    }

    return files;
  }

  /**
   * Check if JSON file is newer than corresponding CSS file
   */
  isJsonNewer(jsonFile, cssFullPath) {
    if (!fs.existsSync(cssFullPath)) {
      return true; // CSS file doesn't exist, need to generate
    }

    const jsonStats = fs.statSync(jsonFile.fullPath);
    const cssStats = fs.statSync(cssFullPath);

    return jsonStats.mtime > cssStats.mtime;
  }

  /**
   * Process a single JSON token file
   */
  async processTokenFile(jsonFile) {
    // Determine output path first
    const cssRelativePath = jsonFile.relativePath.replace(
      /\.tokens\.json$/,
      ".tokens.css",
    );
    const cssFullPath = path.join(this.cssDir, cssRelativePath);

    // Check if JSON is newer than CSS (unless force flag is set)
    if (!this.force && !this.isJsonNewer(jsonFile, cssFullPath)) {
      console.log(`⏭️  Skipping: ${jsonFile.relativePath} (unchanged)`);
      return { skipped: true };
    }

    console.log(`📄 Processing: ${jsonFile.relativePath}`);

    try {
      // Read and parse JSON
      const jsonContent = fs.readFileSync(jsonFile.fullPath, "utf8");
      const tokens = JSON.parse(jsonContent);

      // Generate CSS content
      const cssContent = this.generateCssFromTokens(tokens, jsonFile);

      // Ensure output directory exists
      this.ensureDirectoryExists(path.dirname(cssFullPath));

      // Write CSS file
      fs.writeFileSync(cssFullPath, cssContent, "utf8");

      console.log(
        `   \x1b[32m✓\x1b[0m Generated: \x1b[32mcss/${cssRelativePath}\x1b[0m`,
      );

      return { processed: true };
    } catch (error) {
      console.error(
        `   \x1b[31m❌\x1b[0m Failed to process \x1b[31m${jsonFile.relativePath}\x1b[0m:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Generate CSS content from parsed JSON tokens
   */
  generateCssFromTokens(tokens, jsonFile) {
    const { name, relativePath } = jsonFile;
    const layerName = this.generateLayerName(relativePath);

    // Generate header comment
    const header = this.generateHeader(tokens, name, relativePath);

    // Generate CSS custom properties
    const cssProperties = this.generateCssProperties(tokens);

    // Combine into final CSS
    return `${header}

@layer ${layerName} {
  :root {
${cssProperties.trimEnd()}
  }
}
`;
  }

  /**
   * Generate CSS header comment
   */
  generateHeader(tokens, fileName, relativePath) {
    const title = this.formatTitle(fileName);
    const description =
      tokens.$description || `${title} tokens for the UIID design system`;
    const timestamp = new Date().toISOString();

    return `/**
 * ${title} Tokens
 * ${description}
 *
 * 🚨 AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 *
 * Generated from: json/${relativePath}
 * Generated on: ${timestamp}
 * Generated by: scripts/generate-tokens.js
 */`;
  }

  /**
   * Generate CSS layer name from file path
   */
  generateLayerName(relativePath) {
    const parts = relativePath.replace(/\.tokens\.json$/, "").split(path.sep);
    return `uiid.tokens.${parts.join(".")}`;
  }

  /**
   * Format file name into a proper title
   */
  formatTitle(fileName) {
    return fileName
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Color variant recipes applied to theme tokens.
   * Same ratios used by tone tokens (positive, warning, critical, info).
   */
  colorVariants = [
    { suffix: "surface", mix: "shade-background", ratio: 0.25 },
    { suffix: "border", mix: "shade-background", ratio: 0.40 },
    { suffix: "foreground", mix: "shade-foreground", ratio: 0.60 },
  ];

  /**
   * Generate CSS custom properties from token object
   */
  generateCssProperties(tokens, prefix = "", indent = "    ") {
    let css = "";
    const entries = Object.entries(tokens).filter(
      ([key]) => !key.startsWith("$"),
    );

    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];

      if (this.isTokenValue(value)) {
        // This is a token with a $value
        const cssVarName = this.generateCssVariableName(prefix, key);
        const cssValue = this.processCssValueForToken(value);
        css += `${indent}--${cssVarName}: ${cssValue};\n`;

        // Auto-generate color variants for theme tokens
        if (prefix === "theme") {
          for (const variant of this.colorVariants) {
            const pct = Math.round((1 - variant.ratio) * 100);
            css += `${indent}--${cssVarName}-${variant.suffix}: color-mix(in oklch, var(--${cssVarName}), var(--${variant.mix}) ${pct}%);\n`;
          }
        }
      } else if (typeof value === "object" && value !== null) {
        // This is a nested object, recurse
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        const nestedCss = this.generateCssProperties(value, newPrefix, indent);

        if (nestedCss) {
          css += nestedCss;

          // Add extra newline between top-level groups for readability
          if (!prefix && i < entries.length - 1) {
            css += "\n";
          }
        }
      }
    }

    return css;
  }

  /**
   * Check if an object is a design token (has $value property)
   */
  isTokenValue(obj) {
    return typeof obj === "object" && obj !== null && "$value" in obj;
  }

  /**
   * Generate CSS variable name from prefix and key
   */
  generateCssVariableName(prefix, key) {
    const parts = prefix ? [prefix, key] : [key];
    return parts.join("-");
  }

  /**
   * Process a full token object for CSS output, checking for derive extensions
   */
  processCssValueForToken(token) {
    const derive = token.$extensions?.["org.uiid.derive"];

    if (derive) {
      return this.processDeriveExtension(derive);
    }

    return this.processCssValue(token.$value);
  }

  /**
   * Process org.uiid.derive extension into CSS.
   * For method="mix", resolves both light and dark mode hex values statically
   * using computeColorMix, emitting light-dark(#lightHex, #darkHex).
   */
  processDeriveExtension(derive) {
    if (derive.method === "mix") {
      try {
        const pair1 = this.resolveToHexPair(derive.color1);
        const pair2 = this.resolveToHexPair(derive.color2);
        const lightHex = computeColorMix(pair1.light, pair2.light, 1 - derive.ratio);
        const darkHex = computeColorMix(pair1.dark, pair2.dark, 1 - derive.ratio);
        return `light-dark(${lightHex}, ${darkHex})`;
      } catch (err) {
        // Fall back to color-mix if resolution fails
        console.warn(`  ⚠️  mix fallback: ${err.message}`);
        const color1 = this.processCssValue(derive.color1);
        const color2 = this.processCssValue(derive.color2);
        const pct = Math.round((1 - derive.ratio) * 100);
        return `color-mix(in ${derive.colorSpace}, ${color1}, ${color2} ${pct}%)`;
      }
    }

    if (derive.method === "light-dark") {
      const light = this.processCssValue(derive.light);
      const dark = this.processCssValue(derive.dark);
      return `light-dark(${light}, ${dark})`;
    }

    // Fallback: shouldn't happen
    return "/* unknown derive method */";
  }

  /**
   * Process CSS value, handling references, structured colors, and transformations
   */
  processCssValue(value) {
    if (typeof value === "string") {
      // Handle token references like "{scale}"
      return value.replace(/\{([^}]+)\}/g, (match, tokenPath) => {
        // Convert token reference to CSS variable
        return `var(--${tokenPath.replace(/\./g, "-")})`;
      });
    }

    // Handle structured color objects per Design Tokens Color Module
    if (typeof value === "object" && value !== null && value.colorSpace) {
      return this.colorObjectToCss(value);
    }

    return String(value);
  }

  /**
   * Convert a structured color object to a CSS color value
   */
  colorObjectToCss(color) {
    const { colorSpace, components, alpha } = color;

    if (colorSpace === "oklch") {
      const [l, c, h] = components;
      const alphaStr = alpha !== undefined && alpha !== 1 ? ` / ${alpha}` : "";
      return `oklch(${l} ${c} ${h}${alphaStr})`;
    }

    // For srgb and other spaces, prefer hex fallback if available
    if (color.hex) {
      return color.hex;
    }

    // Generic CSS color() function fallback
    const comps = components.join(" ");
    const alphaStr = alpha !== undefined && alpha !== 1 ? ` / ${alpha}` : "";
    return `color(${colorSpace} ${comps}${alphaStr})`;
  }

  /**
   * Ensure directory exists, creating it if necessary
   */
  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}

// Execute if run directly
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const force = args.includes("--force") || args.includes("-f");

  if (force) {
    console.log("🔄 Force mode enabled - regenerating all files\n");
  }

  const generator = new TokenGenerator({ force });
  generator.generate().catch(console.error);
}

export default TokenGenerator;
