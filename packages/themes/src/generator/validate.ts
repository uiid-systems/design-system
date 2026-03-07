import { hexToSrgb, computeColorMix, contrastRatio } from "../utils/color-utils";
import { THEME_DEFAULTS } from "../schema/theme-input";
import type { ThemeInput } from "../schema/theme-input";
import { buildOverrides, collectDerivedOverrides } from "./overrides";
import type { TokenRegistry, ContrastWarning } from "./types";

/**
 * Same variant recipes as TokenGenerator.colorVariants.
 */
const COLOR_VARIANTS = [
  { suffix: "surface", mixToken: "shade.background", ratio: 0.25 },
  { suffix: "border", mixToken: "shade.background", ratio: 0.40 },
  { suffix: "foreground", mixToken: "shade.foreground", ratio: 0.60 },
];

// Re-export for convenience
export { contrastRatio };

/**
 * Validate a theme for WCAG AA contrast.
 *
 * Runs the same override + derivation pipeline as generate-theme, then checks
 * key color pairs in both light and dark modes.
 *
 * @param theme - Validated theme input
 * @param createRegistry - Factory function that returns a fresh TokenRegistry instance
 */
export async function validateThemeContrast(
  theme: ThemeInput,
  createRegistry: () => TokenRegistry
): Promise<ContrastWarning[]> {
  const generator = createRegistry();
  const jsonFiles = generator.discoverJsonFiles(generator.jsonDir);
  generator.buildRegistry(jsonFiles);

  const overrides = buildOverrides(theme);
  const overriddenPaths = new Set(overrides.keys());
  generator.applyOverrides(overrides);

  const derivedOverrides = collectDerivedOverrides(generator, overriddenPaths);

  // Build a lookup from CSS var name to { light, dark } hex values
  const resolved = new Map<string, { light: string; dark: string }>();

  // Direct theme tokens
  const themeColors: Record<string, string> = {
    primary: theme.primary,
    secondary: theme.secondary,
    positive: theme.positive ?? THEME_DEFAULTS.positive,
    warning: theme.warning ?? THEME_DEFAULTS.warning,
    critical: theme.critical ?? THEME_DEFAULTS.critical,
    info: theme.info ?? THEME_DEFAULTS.info,
  };

  for (const [key, hex] of Object.entries(themeColors)) {
    resolved.set(`--theme-${key}`, { light: hex, dark: hex });
  }
  resolved.set("--theme-white", { light: theme.white, dark: theme.white });
  resolved.set("--theme-black", { light: theme.black, dark: theme.black });

  // Derived tokens (already in light-dark(#hex, #hex) format)
  for (const [cssVar, value] of derivedOverrides) {
    const match = value.match(/light-dark\(([^,]+),\s*([^)]+)\)/);
    if (match) {
      resolved.set(cssVar, { light: match[1].trim(), dark: match[2].trim() });
    }
  }

  // Compute theme variant tokens (surface/border/foreground for each theme color)
  const themeColorKeys = ["primary", "secondary", "positive", "warning", "critical", "info"];
  for (const key of themeColorKeys) {
    const colorHex = resolved.get(`--theme-${key}`);
    if (!colorHex) continue;

    for (const variant of COLOR_VARIANTS) {
      try {
        const mixPair = generator.resolveToHexPair(`{${variant.mixToken}}`);
        const lightHex = computeColorMix(colorHex.light, mixPair.light, 1 - variant.ratio);
        const darkHex = computeColorMix(colorHex.dark, mixPair.dark, 1 - variant.ratio);
        resolved.set(`--theme-${key}-${variant.suffix}`, { light: lightHex, dark: darkHex });
      } catch {
        // Skip if resolution fails
      }
    }
  }

  const warnings: ContrastWarning[] = [];

  function check(fgVar: string, bgVar: string, label: string, required: number) {
    const fg = resolved.get(fgVar);
    const bg = resolved.get(bgVar);
    if (!fg || !bg) return;

    for (const mode of ["light", "dark"] as const) {
      const ratio = contrastRatio(fg[mode], bg[mode]);
      if (ratio < required) {
        const level = ratio < 3 ? "error" : "warning";
        warnings.push({
          level,
          pair: label,
          mode,
          ratio: Math.round(ratio * 100) / 100,
          required,
          message: `${label} (${mode}): ${Math.round(ratio * 100) / 100}:1 — needs ${required}:1 (WCAG AA)`,
        });
      }
    }
  }

  // Core readability: foreground on background (4.5:1 for normal text)
  check("--shade-foreground", "--shade-background", "foreground / background", 4.5);

  // Tone foreground variants on their surface (4.5:1 for normal text)
  for (const tone of ["positive", "critical", "warning", "info"]) {
    check(`--tone-${tone}-fg`, `--tone-${tone}-surface`, `${tone}-fg / ${tone}-surface`, 4.5);
  }

  // Tone base color on background (3:1 for UI components / large text)
  for (const tone of ["positive", "critical", "warning", "info"]) {
    check(`--tone-${tone}`, "--shade-background", `${tone} / background`, 3);
  }

  // Primary / secondary on background (3:1 for UI components)
  check("--theme-primary", "--shade-background", "primary / background", 3);
  check("--theme-secondary", "--shade-background", "secondary / background", 3);

  // Theme variant quality: foreground variant on surface variant (4.5:1 for text)
  for (const key of themeColorKeys) {
    check(
      `--theme-${key}-foreground`, `--theme-${key}-surface`,
      `${key}-foreground / ${key}-surface`, 4.5,
    );
  }

  return warnings;
}
