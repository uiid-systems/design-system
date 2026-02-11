#!/usr/bin/env node

/**
 * Sync Tokens to Figma
 *
 * Reads DTCG-compliant JSON tokens and pushes them to Figma as variables.
 * Can be run locally or in CI/CD (e.g., GitHub Actions).
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=xxx node scripts/sync-to-figma.js
 *
 * Environment variables:
 *   FIGMA_ACCESS_TOKEN - Personal access token from Figma (required)
 *   FIGMA_FILE_KEY     - File key from Figma URL (required)
 *   DRY_RUN            - Set to "true" to preview without pushing (optional)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = path.resolve(__dirname, "../src/json");

// Figma API base URL
const FIGMA_API = "https://api.figma.com/v1";

// =============================================================================
// Configuration
// =============================================================================

const CONFIG = {
  // Map token files to Figma variable collections
  collections: [
    {
      name: "primitives/color",
      sources: [
        "primitives/colors.tokens.json",
        "primitives/colors.generated.tokens.json",
      ],
      modes: ["light", "dark"],
    },
    {
      name: "primitives/typography",
      sources: ["primitives/typography.tokens.json"],
      modes: ["default"],
    },
    {
      name: "primitives/spacing",
      sources: ["primitives/spacing.tokens.json"],
      modes: ["default"],
    },
    {
      name: "semantic/shade",
      sources: ["semantic/shade.tokens.json"],
      modes: ["light", "dark"],
    },
    {
      name: "semantic/tone",
      sources: ["semantic/tone.tokens.json"],
      modes: ["light", "dark"],
    },
    {
      name: "theme",
      sources: ["theme/theme.tokens.json"],
      modes: ["light", "dark"],
    },
  ],
};

// =============================================================================
// Token Parsing
// =============================================================================

/**
 * Recursively extract tokens from DTCG JSON
 */
function extractTokens(obj, prefix = "", inheritedType = null) {
  const tokens = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;

    const path = prefix ? `${prefix}/${key}` : key;
    const type = value.$type || inheritedType;

    if (value.$value !== undefined) {
      tokens.push({
        name: path,
        value: value.$value,
        type: type,
        extensions: value.$extensions,
      });
    } else if (typeof value === "object") {
      tokens.push(...extractTokens(value, path, type));
    }
  }

  return tokens;
}

/**
 * Read and parse a token file
 */
function readTokenFile(relativePath) {
  const fullPath = path.join(TOKENS_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠️  File not found: ${relativePath}`);
    return [];
  }

  const content = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  return extractTokens(content);
}

// =============================================================================
// Figma Variable Conversion
// =============================================================================

/**
 * Convert DTCG token type to Figma variable type
 */
function toFigmaType(dtcgType) {
  const typeMap = {
    color: "COLOR",
    dimension: "FLOAT",
    number: "FLOAT",
    fontWeight: "FLOAT",
    duration: "FLOAT",
    fontFamily: "STRING",
    string: "STRING",
    strokeStyle: "STRING",
  };
  return typeMap[dtcgType] || "STRING";
}

/**
 * Convert hex color to Figma RGBA
 */
function hexToFigmaColor(hex) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i);
  if (!match) {
    console.warn(`  ⚠️  Invalid hex color: ${hex}`);
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  return {
    r: parseInt(match[1], 16) / 255,
    g: parseInt(match[2], 16) / 255,
    b: parseInt(match[3], 16) / 255,
    a: match[4] ? parseInt(match[4], 16) / 255 : 1,
  };
}

/**
 * Parse dimension value to number (strips unit)
 */
function parseDimension(value) {
  if (typeof value === "number") return value;
  const match = String(value).match(/^(-?[\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Convert token value to Figma variable value
 */
function toFigmaValue(token) {
  const { value, type } = token;

  // Handle references (aliases)
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    // Return as alias reference - Figma API handles this differently
    return { type: "VARIABLE_ALIAS", name: value.slice(1, -1).replace(/\./g, "/") };
  }

  switch (type) {
    case "color":
      if (typeof value === "string") {
        return hexToFigmaColor(value);
      }
      return { r: 0, g: 0, b: 0, a: 1 };

    case "dimension":
    case "duration":
      return parseDimension(value);

    case "number":
    case "fontWeight":
      return typeof value === "number" ? value : parseFloat(value) || 0;

    case "fontFamily":
      return Array.isArray(value) ? value.join(", ") : String(value);

    default:
      return String(value);
  }
}

/**
 * Build Figma variable payload for a collection
 */
function buildCollectionPayload(collectionConfig) {
  const { name, sources, modes } = collectionConfig;

  // Read all source files
  const allTokens = [];
  for (const source of sources) {
    const tokens = readTokenFile(source);
    allTokens.push(...tokens);
  }

  console.log(`  📦 ${name}: ${allTokens.length} tokens from ${sources.length} files`);

  // Build variables array
  const variables = allTokens.map((token) => {
    const figmaType = toFigmaType(token.type);
    const figmaValue = toFigmaValue(token);

    // For light/dark modes, check if there's derive info
    const hasLightDark = token.extensions?.["org.uiid.derive"]?.method === "light-dark";

    // Build mode values
    const modeValues = {};
    for (const mode of modes) {
      if (hasLightDark && modes.length > 1) {
        const derive = token.extensions["org.uiid.derive"];
        const ref = mode === "light" ? derive.light : derive.dark;
        modeValues[mode] = {
          type: "VARIABLE_ALIAS",
          name: ref.slice(1, -1).replace(/\./g, "/"),
        };
      } else {
        modeValues[mode] = figmaValue;
      }
    }

    return {
      name: token.name,
      type: figmaType,
      values: modeValues,
      scopes: figmaType === "COLOR" ? ["ALL_FILLS", "STROKE_COLOR"] : ["ALL_SCOPES"],
    };
  });

  return {
    name,
    modes,
    variables,
  };
}

// =============================================================================
// Figma API
// =============================================================================

/**
 * Make a request to Figma API
 */
async function figmaRequest(endpoint, method = "GET", body = null) {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    throw new Error("FIGMA_ACCESS_TOKEN environment variable is required");
  }

  const options = {
    method,
    headers: {
      "X-Figma-Token": token,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${FIGMA_API}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Figma API error (${response.status}): ${error}`);
  }

  return response.json();
}

/**
 * Get existing variable collections from a file
 */
async function getExistingVariables(fileKey) {
  const data = await figmaRequest(`/files/${fileKey}/variables/local`);
  return data;
}

/**
 * Post variable changes to Figma
 */
async function postVariables(fileKey, payload) {
  return figmaRequest(`/files/${fileKey}/variables`, "POST", payload);
}

// =============================================================================
// Main Sync Logic
// =============================================================================

/**
 * Build the full Figma API payload
 */
function buildFullPayload() {
  console.log("\n📊 Building token payload...\n");

  const collections = [];

  for (const collectionConfig of CONFIG.collections) {
    const payload = buildCollectionPayload(collectionConfig);
    if (payload.variables.length > 0) {
      collections.push(payload);
    }
  }

  return collections;
}

/**
 * Preview what would be synced (dry run)
 */
function previewSync(collections) {
  console.log("\n🔍 DRY RUN - Preview of changes:\n");

  for (const collection of collections) {
    console.log(`Collection: ${collection.name}`);
    console.log(`  Modes: ${collection.modes.join(", ")}`);
    console.log(`  Variables: ${collection.variables.length}`);

    // Show first few variables as sample
    const sample = collection.variables.slice(0, 5);
    for (const v of sample) {
      console.log(`    - ${v.name} (${v.type})`);
    }
    if (collection.variables.length > 5) {
      console.log(`    ... and ${collection.variables.length - 5} more`);
    }
    console.log();
  }
}

/**
 * Sync to Figma
 */
async function syncToFigma(collections) {
  const fileKey = process.env.FIGMA_FILE_KEY;
  if (!fileKey) {
    throw new Error("FIGMA_FILE_KEY environment variable is required");
  }

  console.log(`\n🚀 Syncing to Figma file: ${fileKey}\n`);

  // Get existing variables to determine create vs update
  console.log("  Fetching existing variables...");
  const existing = await getExistingVariables(fileKey);

  const existingCollections = new Map();
  if (existing.meta?.variableCollections) {
    for (const [id, coll] of Object.entries(existing.meta.variableCollections)) {
      existingCollections.set(coll.name, { id, ...coll });
    }
  }

  const existingVars = new Map();
  if (existing.meta?.variables) {
    for (const [id, v] of Object.entries(existing.meta.variables)) {
      existingVars.set(v.name, { id, ...v });
    }
  }

  console.log(`  Found ${existingCollections.size} collections, ${existingVars.size} variables\n`);

  // Build API payload
  const payload = {
    variableCollections: [],
    variableModes: [],
    variables: [],
    variableModeValues: [],
  };

  for (const collection of collections) {
    const existingColl = existingCollections.get(collection.name);

    if (existingColl) {
      console.log(`  📝 Updating collection: ${collection.name}`);
      // Update existing collection's variables
      for (const variable of collection.variables) {
        const fullName = `${collection.name}/${variable.name}`;
        const existingVar = existingVars.get(variable.name);

        if (existingVar) {
          // Update existing variable
          payload.variables.push({
            action: "UPDATE",
            id: existingVar.id,
            name: variable.name,
          });

          // Update mode values
          for (const [modeName, value] of Object.entries(variable.values)) {
            const mode = existingColl.modes?.find((m) => m.name === modeName);
            if (mode && value.type !== "VARIABLE_ALIAS") {
              payload.variableModeValues.push({
                action: "UPDATE",
                variableId: existingVar.id,
                modeId: mode.modeId,
                value: value,
              });
            }
          }
        } else {
          // Create new variable in existing collection
          payload.variables.push({
            action: "CREATE",
            id: `new_${fullName.replace(/\//g, "_")}`,
            name: variable.name,
            variableCollectionId: existingColl.id,
            resolvedType: variable.type,
            scopes: variable.scopes,
          });
        }
      }
    } else {
      console.log(`  ✨ Creating collection: ${collection.name}`);

      const collectionId = `new_coll_${collection.name.replace(/\//g, "_")}`;

      // Create new collection
      payload.variableCollections.push({
        action: "CREATE",
        id: collectionId,
        name: collection.name,
        initialModeId: `mode_${collection.modes[0]}`,
      });

      // Create modes
      for (let i = 0; i < collection.modes.length; i++) {
        const modeName = collection.modes[i];
        if (i === 0) {
          // Rename initial mode
          payload.variableModes.push({
            action: "UPDATE",
            id: `mode_${modeName}`,
            name: modeName,
            variableCollectionId: collectionId,
          });
        } else {
          // Create additional modes
          payload.variableModes.push({
            action: "CREATE",
            id: `mode_${modeName}`,
            name: modeName,
            variableCollectionId: collectionId,
          });
        }
      }

      // Create variables
      for (const variable of collection.variables) {
        const varId = `new_var_${collection.name}_${variable.name}`.replace(/\//g, "_");

        payload.variables.push({
          action: "CREATE",
          id: varId,
          name: variable.name,
          variableCollectionId: collectionId,
          resolvedType: variable.type,
          scopes: variable.scopes,
        });

        // Set mode values
        for (const [modeName, value] of Object.entries(variable.values)) {
          if (value.type !== "VARIABLE_ALIAS") {
            payload.variableModeValues.push({
              action: "CREATE",
              variableId: varId,
              modeId: `mode_${modeName}`,
              value: value,
            });
          }
        }
      }
    }
  }

  // Post to Figma
  console.log("\n  Posting to Figma API...");
  const result = await postVariables(fileKey, payload);
  console.log("  ✅ Sync complete!");

  return result;
}

// =============================================================================
// CLI
// =============================================================================

async function main() {
  console.log("🎨 UIID Token → Figma Sync\n");

  const isDryRun = process.env.DRY_RUN === "true";
  const collections = buildFullPayload();

  const totalVars = collections.reduce((sum, c) => sum + c.variables.length, 0);
  console.log(`\n📈 Total: ${collections.length} collections, ${totalVars} variables`);

  if (isDryRun) {
    previewSync(collections);
    console.log("ℹ️  Dry run complete. Set DRY_RUN=false to sync to Figma.");
  } else {
    if (!process.env.FIGMA_ACCESS_TOKEN || !process.env.FIGMA_FILE_KEY) {
      console.log("\n⚠️  Missing environment variables. Running in preview mode.\n");
      previewSync(collections);
      console.log("To sync to Figma, set:");
      console.log("  FIGMA_ACCESS_TOKEN=<your-token>");
      console.log("  FIGMA_FILE_KEY=<file-key-from-url>");
    } else {
      await syncToFigma(collections);
    }
  }
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
