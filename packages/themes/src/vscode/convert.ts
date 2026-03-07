import type { ThemeInput } from "../schema/theme-input";
import { THEME_DEFAULTS } from "../schema/theme-input";
import { NEUTRAL_MAPPING, ACCENT_MAPPING, type AccentField } from "./mapping";
import { stripJsonc } from "./strip-jsonc";

export interface ConvertVscodeThemeOptions {
  /** Override the output theme name (defaults to VSCode theme name). */
  name?: string;
}

export interface ConvertVscodeThemeResult {
  theme: ThemeInput;
  warnings: string[];
}

interface VscodeTheme {
  name?: string;
  type?: "dark" | "light" | "hc" | "hcLight";
  colors?: Record<string, string>;
  tokenColors?: unknown[];
  semanticTokenColors?: Record<string, unknown>;
  include?: string;
}

/**
 * Convert a VSCode theme into a UIID theme input JSON.
 *
 * @param input - Raw JSONC string or already-parsed VSCode theme object.
 * @param options - Optional overrides.
 * @returns The converted UIID theme and any warnings encountered.
 */
export function convertVscodeTheme(
  input: string | VscodeTheme,
  options?: ConvertVscodeThemeOptions,
): ConvertVscodeThemeResult {
  const warnings: string[] = [];

  const vscode: VscodeTheme =
    typeof input === "string" ? JSON.parse(stripJsonc(input)) : input;

  if (vscode.include) {
    warnings.push(
      `Theme uses "include" to extend "${vscode.include}". Inherited colors are not resolved — output may be incomplete.`,
    );
  }

  const colors = vscode.colors ?? {};
  const isDark = detectThemeType(vscode) === "dark";
  const mode = isDark ? "dark" : "light";

  const name =
    options?.name ?? vscode.name ?? `Imported VSCode Theme`;

  // Resolve neutral anchors (white / black)
  const white = resolveNeutral("white", colors, mode, warnings);
  const black = resolveNeutral("black", colors, mode, warnings);

  // Resolve accent / tone colors
  const accents: Partial<Record<AccentField, string>> = {};
  for (const field of Object.keys(ACCENT_MAPPING) as AccentField[]) {
    const value = resolveAccent(field, colors, warnings);
    if (value) accents[field] = value;
  }

  const theme: ThemeInput = {
    name,
    white,
    black,
    primary: accents.primary ?? THEME_DEFAULTS.critical, // fallback to a visible color
    secondary: accents.secondary ?? accents.primary ?? THEME_DEFAULTS.info,
    ...(accents.positive && { positive: accents.positive }),
    ...(accents.warning && { warning: accents.warning }),
    ...(accents.critical && { critical: accents.critical }),
    ...(accents.info && { info: accents.info }),
  };

  if (!accents.primary) {
    warnings.push(
      `No primary accent color found. Falling back to default critical color (${THEME_DEFAULTS.critical}).`,
    );
  }

  if (!accents.secondary) {
    warnings.push(
      `No secondary accent color found. Falling back to ${accents.primary ? "primary" : "default info"} color.`,
    );
  }

  return { theme, warnings };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function detectThemeType(vscode: VscodeTheme): "dark" | "light" {
  if (vscode.type === "dark" || vscode.type === "hc") return "dark";
  if (vscode.type === "light" || vscode.type === "hcLight") return "light";

  // Heuristic: if editor.background exists, check its luminance
  const bg = vscode.colors?.["editor.background"];
  if (bg) {
    const hex = normalizeHex(bg);
    if (hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5 ? "dark" : "light";
    }
  }

  return "dark"; // safe default
}

/**
 * Normalize a VSCode hex color to 6-digit hex.
 * Handles 3-digit (#abc), 6-digit (#aabbcc), and 8-digit (#aabbccdd) formats.
 * Returns null for invalid values.
 */
function normalizeHex(raw: string): string | null {
  if (!raw || !raw.startsWith("#")) return null;

  const hex = raw.slice(1);

  if (hex.length === 3) {
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  if (hex.length === 6) {
    return raw;
  }

  // 8-digit: strip alpha channel
  if (hex.length === 8) {
    return `#${hex.slice(0, 6)}`;
  }

  return null;
}

function resolveNeutral(
  field: "white" | "black",
  colors: Record<string, string>,
  mode: "dark" | "light",
  warnings: string[],
): string {
  const keys = NEUTRAL_MAPPING[field][mode];

  for (const key of keys) {
    const raw = colors[key];
    if (raw) {
      const hex = normalizeHex(raw);
      if (hex) return hex;
    }
  }

  // Fallback
  const fallback = field === "white" ? "#ffffff" : "#000000";
  warnings.push(
    `Could not find "${field}" neutral from VSCode colors (tried: ${keys.join(", ")}). Using fallback ${fallback}.`,
  );
  return fallback;
}

function resolveAccent(
  field: AccentField,
  colors: Record<string, string>,
  warnings: string[],
): string | null {
  const keys = ACCENT_MAPPING[field];

  for (const key of keys) {
    const raw = colors[key];
    if (raw) {
      const hex = normalizeHex(raw);
      if (hex) return hex;
    }
  }

  // Only warn for optional tone fields — primary/secondary warnings are handled by the caller
  if (field !== "primary" && field !== "secondary") {
    warnings.push(
      `No "${field}" tone color found (tried: ${keys.join(", ")}). Will use UIID default.`,
    );
  }

  return null;
}
