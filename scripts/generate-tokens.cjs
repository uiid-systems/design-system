#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

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
 * Generated by: scripts/generate-tokens.cjs
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
   * Process org.uiid.derive extension into CSS
   */
  processDeriveExtension(derive) {
    if (derive.method === "mix") {
      const color1 = this.processCssValue(derive.color1);
      const color2 = this.processCssValue(derive.color2);
      const pct = Math.round((1 - derive.ratio) * 100);
      return `color-mix(in ${derive.colorSpace}, ${color1}, ${color2} ${pct}%)`;
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
if (require.main === module) {
  const args = process.argv.slice(2);
  const force = args.includes("--force") || args.includes("-f");

  if (force) {
    console.log("🔄 Force mode enabled - regenerating all files\n");
  }

  const generator = new TokenGenerator({ force });
  generator.generate().catch(console.error);
}

module.exports = TokenGenerator;
