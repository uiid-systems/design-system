import fs from "fs";
import path from "path";
import { ThemeInputSchema, THEME_DEFAULTS } from "../schema/theme-input";
import { buildOverrides, collectDerivedOverrides } from "./overrides";
import { generateCss } from "./css";
import { validateThemeContrast } from "./validate";
import type { TokenRegistry } from "./types";

export interface GenerateThemeOptions {
  dryRun?: boolean;
}

export interface GenerateThemeResult {
  directOverrides: Map<string, string>;
  derivedOverrides: Map<string, string>;
  css: string;
  warnings: Array<{
    level: "error" | "warning";
    pair: string;
    mode: string;
    ratio: number;
    required: number;
    message: string;
  }>;
}

/**
 * Generate a theme CSS override file from a theme JSON input.
 *
 * @param inputPath - Path to theme JSON file
 * @param outputPath - Path for generated CSS output
 * @param createRegistry - Factory function that returns a fresh TokenRegistry
 * @param options - Generation options
 */
export async function generateTheme(
  inputPath: string,
  outputPath: string,
  createRegistry: () => TokenRegistry,
  options: GenerateThemeOptions = {}
): Promise<GenerateThemeResult> {
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

  // 2. Build token registry
  const generator = createRegistry();
  const jsonFiles = generator.discoverJsonFiles(generator.jsonDir);
  generator.buildRegistry(jsonFiles);

  // 3. Build overrides and apply them
  const overrides = buildOverrides(theme);
  const overriddenPaths = new Set(overrides.keys());
  generator.applyOverrides(overrides);

  // 4. Collect direct CSS overrides for theme tokens
  const directOverrides = new Map<string, string>();
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

  // 8. Validate contrast
  const warnings = await validateThemeContrast(theme, createRegistry);

  const label = dryRun ? "(dry run)" : `→ ${outputPath}`;
  console.log(`Theme "${theme.name}" ${label}`);
  console.log(`  ${directOverrides.size} direct overrides, ${derivedOverrides.size} derived tokens`);

  if (warnings.length > 0) {
    console.log(`  ${warnings.length} contrast warning(s):`);
    for (const w of warnings) {
      const icon = w.level === "error" ? "✗" : "!";
      console.log(`    ${icon} ${w.message}`);
    }
  } else {
    console.log("  All contrast checks passed");
  }

  return { directOverrides, derivedOverrides, css, warnings };
}
