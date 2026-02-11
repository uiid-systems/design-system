import StyleDictionary from "style-dictionary";
import { generateColorScale, computeColorMix, oklchToHex } from "./transforms/color-utils.js";

/**
 * UIID Design Tokens - Style Dictionary Configuration
 *
 * Transforms DTCG-compliant JSON tokens into:
 * - CSS custom properties
 * - Generated primitive scales (colors.generated.json)
 * - Figma-compatible JSON (for Tokens Studio)
 */

// =============================================================================
// Custom Transforms
// =============================================================================

/**
 * Transform: Generate color scales from org.uiid.derive.method === "scale"
 * Reads OKLCH source, generates 50-950 scale steps
 */
StyleDictionary.registerTransform({
  name: "uiid/color-scale",
  type: "value",
  filter: (token) => {
    return (
      token.$type === "color" &&
      token.$extensions?.["org.uiid.derive"]?.method === "scale"
    );
  },
  transform: (token) => {
    // Return original value; scale generation happens in action
    return token.$value;
  },
});

/**
 * Transform: Resolve org.uiid.derive.method === "mix"
 * Computes color-mix at build time
 */
StyleDictionary.registerTransform({
  name: "uiid/color-mix",
  type: "value",
  filter: (token) => {
    return (
      token.$type === "color" &&
      token.$extensions?.["org.uiid.derive"]?.method === "mix"
    );
  },
  transform: (token, config, options, platform) => {
    const derive = token.$extensions["org.uiid.derive"];
    // Note: This requires resolved references; may need preprocessor
    // For now, return the pre-computed $value if available
    return token.$value;
  },
});

/**
 * Transform: Resolve org.uiid.derive.method === "light-dark"
 * For CSS, outputs light-dark() function; for Figma, picks light mode value
 */
StyleDictionary.registerTransform({
  name: "uiid/light-dark/css",
  type: "value",
  filter: (token) => {
    return (
      token.$type === "color" &&
      token.$extensions?.["org.uiid.derive"]?.method === "light-dark"
    );
  },
  transform: (token) => {
    // For CSS output, we want the light-dark() function
    // The actual resolution happens in the CSS via the function
    return token.$value;
  },
});

// =============================================================================
// Custom Actions
// =============================================================================

/**
 * Action: Generate color scale tokens
 * Creates colors.generated.json with full 50-950 scales for each hue
 */
StyleDictionary.registerAction({
  name: "generate-color-scales",
  do: async (dictionary, config) => {
    const fs = await import("fs");
    const path = await import("path");

    const generated = {
      $description: "UIID Design System - Generated Color Scales (AUTO-GENERATED)",
      color: {
        $type: "color",
      },
    };

    // Find tokens with scale derivation
    dictionary.allTokens.forEach((token) => {
      const derive = token.$extensions?.["org.uiid.derive"];
      const source = token.$extensions?.["org.uiid.source"];

      if (derive?.method === "scale" && source?.colorSpace === "oklch") {
        const colorName = token.path[token.path.length - 1];
        const [l, c, h] = source.components;
        const steps = derive.steps || 11;

        // Generate scale
        const scale = generateColorScale(l, c, h, steps);

        // Add to generated tokens
        generated.color[colorName] = {};
        scale.forEach(({ step, hex, oklch }) => {
          generated.color[colorName][step] = {
            $value: hex,
            $extensions: {
              "org.uiid.source": {
                colorSpace: "oklch",
                components: oklch,
              },
            },
          };
        });
      }
    });

    // Write generated file
    const outputPath = path.resolve(
      config.buildPath || "./src/json/primitives/",
      "colors.generated.tokens.json"
    );

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(generated, null, 2) + "\n");

    console.log(`  ✓ Generated color scales: ${outputPath}`);
  },
  undo: async (dictionary, config) => {
    const fs = await import("fs");
    const path = await import("path");

    const outputPath = path.resolve(
      config.buildPath || "./src/json/primitives/",
      "colors.generated.tokens.json"
    );

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  },
});

// =============================================================================
// Custom Formats
// =============================================================================

/**
 * Format: CSS with @layer and UIID conventions
 */
StyleDictionary.registerFormat({
  name: "css/uiid-layers",
  format: ({ dictionary, file, options }) => {
    const layerName = options.layer || "uiid.tokens";
    const timestamp = new Date().toISOString();

    let css = `/**
 * UIID Design Tokens
 *
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 *
 * Generated on: ${timestamp}
 * Generated by: Style Dictionary
 */

@layer ${layerName} {
  :root {
`;

    dictionary.allTokens.forEach((token) => {
      const name = token.name;
      const value = token.$value || token.value;
      css += `    --${name}: ${value};\n`;
    });

    css += `  }
}
`;

    return css;
  },
});

// =============================================================================
// Configuration
// =============================================================================

export default {
  source: ["src/json/**/*.tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      transforms: ["uiid/color-scale", "uiid/color-mix", "uiid/light-dark/css"],
      buildPath: "src/css/",
      files: [
        {
          destination: "primitives/colors.generated.tokens.css",
          format: "css/uiid-layers",
          filter: (token) => token.filePath?.includes("colors.generated"),
          options: {
            layer: "uiid.tokens.primitives.colors",
          },
        },
      ],
      actions: ["generate-color-scales"],
    },
    json: {
      transformGroup: "js",
      buildPath: "src/json/primitives/",
      actions: ["generate-color-scales"],
    },
  },
};
