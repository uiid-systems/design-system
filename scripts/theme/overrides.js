import { computeColorMix } from "../../packages/tokens/transforms/color-utils.js";
import { THEME_DEFAULTS } from "../../packages/tokens/src/schema/theme-input.ts";

/**
 * Build override map from a validated theme input.
 *
 * Sets theme tokens and their backing color.* primitives
 * so that any token referencing either path gets the user-supplied value.
 *
 * @param {import("../../packages/tokens/src/schema/theme-input.ts").ThemeInput} theme
 * @returns {Map<string, string>}
 */
export function buildOverrides(theme) {
  const overrides = new Map();

  // White/black → affects shade.background and shade.foreground via light-dark
  overrides.set("color.white", theme.white);
  overrides.set("color.black", theme.black);
  overrides.set("theme.white", theme.white);
  overrides.set("theme.black", theme.black);

  // Brand colors
  overrides.set("theme.primary", theme.primary);
  overrides.set("theme.secondary", theme.secondary);

  return overrides;
}

/**
 * Collect all registry entries with org.uiid.derive that transitively depend
 * on any overridden token path. Returns a Map of cssVarName → cssValue.
 */
export function collectDerivedOverrides(generator, overriddenPaths) {
  const result = new Map();

  for (const [tokenPath, token] of generator.registry) {
    const derive = token.$extensions?.["org.uiid.derive"];
    if (!derive) continue;

    if (!dependsOnOverrides(generator, tokenPath, overriddenPaths, new Set())) {
      continue;
    }

    const cssVar = `--${tokenPath.replace(/\./g, "-")}`;

    try {
      if (derive.method === "mix") {
        const pair1 = generator.resolveToHexPair(derive.color1);
        const pair2 = generator.resolveToHexPair(derive.color2);
        const lightHex = computeColorMix(pair1.light, pair2.light, 1 - derive.ratio);
        const darkHex = computeColorMix(pair1.dark, pair2.dark, 1 - derive.ratio);
        result.set(cssVar, `light-dark(${lightHex}, ${darkHex})`);
      } else if (derive.method === "light-dark") {
        const lightPair = generator.resolveToHexPair(derive.light);
        const darkPair = generator.resolveToHexPair(derive.dark);
        result.set(cssVar, `light-dark(${lightPair.light}, ${darkPair.dark})`);
      }
    } catch (err) {
      console.warn(`  Warning: could not resolve ${tokenPath}: ${err.message}`);
    }
  }

  return result;
}

/**
 * Recursively check if a token depends on any overridden path.
 */
function dependsOnOverrides(generator, tokenPath, overriddenPaths, visited) {
  if (overriddenPaths.has(tokenPath)) return true;
  if (visited.has(tokenPath)) return false;

  visited.add(tokenPath);

  const token = generator.registry.get(tokenPath);
  if (!token) return false;

  const derive = token.$extensions?.["org.uiid.derive"];
  if (derive) {
    const refs = [];
    if (derive.light) refs.push(derive.light);
    if (derive.dark) refs.push(derive.dark);
    if (derive.color1) refs.push(derive.color1);
    if (derive.color2) refs.push(derive.color2);

    for (const ref of refs) {
      if (typeof ref === "string" && ref.startsWith("{") && ref.endsWith("}")) {
        const refPath = ref.slice(1, -1);
        if (dependsOnOverrides(generator, refPath, overriddenPaths, visited)) {
          return true;
        }
      }
    }
  }

  // Also check plain $value references
  const value = token.$value;
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    const refPath = value.slice(1, -1);
    if (dependsOnOverrides(generator, refPath, overriddenPaths, visited)) {
      return true;
    }
  }

  return false;
}
