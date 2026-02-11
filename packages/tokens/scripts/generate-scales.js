#!/usr/bin/env node

/**
 * Generate Color Scales
 *
 * Reads colors.tokens.json and generates colors.generated.tokens.json
 * with full 50-950 scales for each hue that has org.uiid.derive.method === "scale"
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateColorScale, oklchToHex } from "../transforms/color-utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = path.resolve(__dirname, "../src/json/primitives");

async function main() {
  console.log("🎨 Generating color scales...\n");

  // Read source colors
  const colorsPath = path.join(TOKENS_DIR, "colors.tokens.json");
  const colorsJson = JSON.parse(fs.readFileSync(colorsPath, "utf-8"));

  const generated = {
    $description:
      "UIID Design System - Generated Color Scales (AUTO-GENERATED - DO NOT EDIT)",
    $schema: "../../../dtcg.schema.json",
    color: {
      $type: "color",
    },
  };

  let scalesGenerated = 0;

  // Process each color that has OKLCH source info
  for (const [colorName, colorDef] of Object.entries(colorsJson.color)) {
    // Skip $type and other meta properties
    if (colorName.startsWith("$")) continue;
    if (typeof colorDef !== "object" || !colorDef.$value) continue;

    const source = colorDef.$extensions?.["org.uiid.source"];

    // Generate scales for all colors with OKLCH source (except white/black)
    if (source?.colorSpace === "oklch" && !["white", "black"].includes(colorName)) {
      const [l, c, h] = source.components;
      const steps = 11;

      console.log(`  📊 ${colorName}: generating ${steps}-step scale from OKLCH(${l}, ${c}, ${h})`);

      // Generate scale
      const scale = generateColorScale(l, c, h, steps);

      // Add to generated tokens
      generated.color[colorName] = {
        $type: "color",
      };

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

      scalesGenerated++;
    }
  }

  // Also add neutral scale (shade) if not already present
  // This uses white/black to generate the neutral ramp
  const white = colorsJson.color.white;
  const black = colorsJson.color.black;

  if (white && black) {
    console.log(`  📊 neutral: generating 11-step grayscale`);

    generated.color.neutral = {
      $type: "color",
    };

    // Neutral scale uses fixed lightness with zero chroma
    const NEUTRAL_LIGHTNESS = {
      50: 0.985,
      100: 0.965,
      200: 0.925,
      300: 0.870,
      400: 0.780,
      500: 0.650,
      600: 0.520,
      700: 0.400,
      800: 0.300,
      900: 0.200,
      950: 0.100,
    };

    for (const [step, lightness] of Object.entries(NEUTRAL_LIGHTNESS)) {
      // Warm neutral: tiny bit of yellow hue (matching your white #fefefa)
      const hex = oklchToHex(lightness, 0.005, 90);

      generated.color.neutral[step] = {
        $value: hex,
        $extensions: {
          "org.uiid.source": {
            colorSpace: "oklch",
            components: [lightness, 0.005, 90],
          },
        },
      };
    }

    scalesGenerated++;
  }

  // Write generated file
  const outputPath = path.join(TOKENS_DIR, "colors.generated.tokens.json");
  fs.writeFileSync(outputPath, JSON.stringify(generated, null, 2) + "\n");

  console.log(`\n✅ Generated ${scalesGenerated} color scales → ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
