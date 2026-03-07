import { computeColorMix } from "../utils/color-utils";
import { THEME_DEFAULTS } from "../schema/theme-input";
import type { ThemeInput } from "../schema/theme-input";
import type { TokenRegistry } from "./types";

/**
 * Build override map from a validated theme input.
 *
 * Sets both theme tokens and their backing color.* / tone.* primitives
 * so that any token referencing either path gets the user-supplied value.
 */
export function buildOverrides(theme: ThemeInput): Map<string, string> {
  const overrides = new Map<string, string>();

  // White/black → affects shade.background and shade.foreground via light-dark
  overrides.set("color.white", theme.white);
  overrides.set("color.black", theme.black);
  overrides.set("theme.white", theme.white);
  overrides.set("theme.black", theme.black);

  // Brand colors
  overrides.set("theme.primary", theme.primary);
  overrides.set("theme.secondary", theme.secondary);

  // Tone colors (with defaults)
  const positive = theme.positive ?? THEME_DEFAULTS.positive;
  const warning = theme.warning ?? THEME_DEFAULTS.warning;
  const critical = theme.critical ?? THEME_DEFAULTS.critical;
  const info = theme.info ?? THEME_DEFAULTS.info;

  overrides.set("theme.positive", positive);
  overrides.set("theme.warning", warning);
  overrides.set("theme.critical", critical);
  overrides.set("theme.info", info);

  // Also set tone.* base values since they alias theme.*
  overrides.set("tone.positive", positive);
  overrides.set("tone.warning", warning);
  overrides.set("tone.critical", critical);
  overrides.set("tone.info", info);

  return overrides;
}

/**
 * Collect all registry entries with org.uiid.derive that transitively depend
 * on any overridden token path. Returns a Map of cssVarName → cssValue.
 */
export function collectDerivedOverrides(
  generator: TokenRegistry,
  overriddenPaths: Set<string>
): Map<string, string> {
  const result = new Map<string, string>();

  for (const [tokenPath, token] of generator.registry) {
    const derive = token.$extensions?.["org.uiid.derive"];
    if (!derive) continue;

    if (!dependsOnOverrides(generator, tokenPath, overriddenPaths, new Set())) {
      continue;
    }

    const cssVar = `--${tokenPath.replace(/\./g, "-")}`;

    try {
      if (derive.method === "mix") {
        const pair1 = generator.resolveToHexPair(derive.color1!);
        const pair2 = generator.resolveToHexPair(derive.color2!);
        const lightHex = computeColorMix(pair1.light, pair2.light, 1 - derive.ratio!);
        const darkHex = computeColorMix(pair1.dark, pair2.dark, 1 - derive.ratio!);
        result.set(cssVar, `light-dark(${lightHex}, ${darkHex})`);
      } else if (derive.method === "light-dark") {
        const lightPair = generator.resolveToHexPair(derive.light!);
        const darkPair = generator.resolveToHexPair(derive.dark!);
        result.set(cssVar, `light-dark(${lightPair.light}, ${darkPair.dark})`);
      }
    } catch (err) {
      console.warn(`  Warning: could not resolve ${tokenPath}: ${(err as Error).message}`);
    }
  }

  return result;
}

/**
 * Recursively check if a token depends on any overridden path.
 */
function dependsOnOverrides(
  generator: TokenRegistry,
  tokenPath: string,
  overriddenPaths: Set<string>,
  visited: Set<string>
): boolean {
  if (overriddenPaths.has(tokenPath)) return true;
  if (visited.has(tokenPath)) return false;

  visited.add(tokenPath);

  const token = generator.registry.get(tokenPath);
  if (!token) return false;

  const derive = token.$extensions?.["org.uiid.derive"];
  if (derive) {
    const refs: (string | undefined)[] = [];
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
