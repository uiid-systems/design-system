import { hexToSrgb } from "../../packages/tokens/transforms/color-utils.js";
import { THEME_DEFAULTS } from "../../packages/tokens/src/schema/theme-input.ts";
import { buildOverrides, collectDerivedOverrides } from "./overrides.js";

/**
 * Relative luminance per WCAG 2.x (sRGB input [0-1]).
 */
function relativeLuminance(r, g, b) {
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG contrast ratio between two hex colors (always >= 1).
 */
export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(...hexToSrgb(hex1));
  const l2 = relativeLuminance(...hexToSrgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * @typedef {Object} ContrastWarning
 * @property {"error" | "warning"} level
 * @property {string} pair - e.g. "foreground / background"
 * @property {string} mode - "light" or "dark"
 * @property {number} ratio - actual contrast ratio
 * @property {number} required - minimum required ratio
 * @property {string} message
 */

/**
 * Validate a theme for WCAG AA contrast.
 *
 * Runs the same override + derivation pipeline as generate-theme, then checks
 * key color pairs in both light and dark modes.
 *
 * @param {import("../../packages/tokens/src/schema/theme-input.ts").ThemeInput} theme
 * @param {import("../../scripts/generate-tokens.js").default} TokenGenerator
 * @returns {Promise<ContrastWarning[]>}
 */
export async function validateThemeContrast(theme, TokenGenerator) {
  const generator = new TokenGenerator({ force: true });
  const jsonFiles = generator.discoverJsonFiles(generator.jsonDir);
  generator.buildRegistry(jsonFiles);

  const overrides = buildOverrides(theme);
  const overriddenPaths = new Set(overrides.keys());
  generator.applyOverrides(overrides);

  const derivedOverrides = collectDerivedOverrides(generator, overriddenPaths);

  // Build a lookup from CSS var name to { light, dark } hex values
  const resolved = new Map();

  // Direct theme tokens
  const themeColors = {
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

  const warnings = [];

  function check(fgVar, bgVar, label, required) {
    const fg = resolved.get(fgVar);
    const bg = resolved.get(bgVar);
    if (!fg || !bg) return;

    for (const mode of ["light", "dark"]) {
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

  return warnings;
}
