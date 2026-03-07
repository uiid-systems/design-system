import { z } from "zod";

/**
 * 6-digit hex color string (e.g. "#ff00aa").
 */
export const HexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex color (e.g. #ff00aa)");

/**
 * Theme input schema for user-supplied brand palettes.
 *
 * Required: name, primary, secondary.
 * Optional: white, black (default to #ffffff / #0d0d0d).
 * Optional tone overrides fall back to THEME_DEFAULTS.
 */
export const ThemeInputSchema = z.object({
  name: z.string().min(1, "Theme name is required"),
  white: HexColor,
  black: HexColor,
  primary: HexColor,
  secondary: HexColor,
  positive: HexColor.optional(),
  warning: HexColor.optional(),
  critical: HexColor.optional(),
  info: HexColor.optional(),
});

export type ThemeInput = z.infer<typeof ThemeInputSchema>;

/**
 * Default values for optional tone fields, pulled from the default palette
 * in colors.tokens.json.
 */
export const THEME_DEFAULTS = {
  positive: "#00c565",
  warning: "#e8b700",
  critical: "#f9262a",
  info: "#347eff",
} as const satisfies Record<string, string>;
