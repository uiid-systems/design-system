import { describe, it, expect } from "vitest";
import { ThemeInputSchema, HexColor, THEME_DEFAULTS } from "../schema/theme-input";

describe("HexColor", () => {
  it("accepts valid 6-digit hex", () => {
    expect(HexColor.safeParse("#ff00aa").success).toBe(true);
    expect(HexColor.safeParse("#000000").success).toBe(true);
    expect(HexColor.safeParse("#FFFFFF").success).toBe(true);
  });

  it("rejects invalid hex formats", () => {
    expect(HexColor.safeParse("#fff").success).toBe(false);
    expect(HexColor.safeParse("ff00aa").success).toBe(false);
    expect(HexColor.safeParse("#gggggg").success).toBe(false);
    expect(HexColor.safeParse("").success).toBe(false);
    expect(HexColor.safeParse("#ff00aa00").success).toBe(false);
  });
});

describe("ThemeInputSchema", () => {
  const validTheme = {
    name: "Test",
    white: "#fefefa",
    black: "#0d0d0d",
    primary: "#ff0000",
    secondary: "#9036e1",
  };

  it("accepts a minimal valid theme (required fields only)", () => {
    const result = ThemeInputSchema.safeParse(validTheme);
    expect(result.success).toBe(true);
  });

  it("accepts a full theme with all optional fields", () => {
    const result = ThemeInputSchema.safeParse({
      ...validTheme,
      positive: "#00c565",
      warning: "#e8b700",
      critical: "#f9262a",
      info: "#347eff",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    for (const field of ["name", "white", "black", "primary", "secondary"]) {
      const { [field]: _, ...rest } = validTheme;
      const result = ThemeInputSchema.safeParse(rest);
      expect(result.success).toBe(false);
    }
  });

  it("rejects empty name", () => {
    const result = ThemeInputSchema.safeParse({ ...validTheme, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid hex in required fields", () => {
    const result = ThemeInputSchema.safeParse({
      ...validTheme,
      primary: "not-a-hex",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid hex in optional fields", () => {
    const result = ThemeInputSchema.safeParse({
      ...validTheme,
      positive: "#xyz",
    });
    expect(result.success).toBe(false);
  });
});

describe("THEME_DEFAULTS", () => {
  it("has defaults for all four tone colors", () => {
    expect(THEME_DEFAULTS.positive).toMatch(/^#[0-9a-f]{6}$/i);
    expect(THEME_DEFAULTS.warning).toMatch(/^#[0-9a-f]{6}$/i);
    expect(THEME_DEFAULTS.critical).toMatch(/^#[0-9a-f]{6}$/i);
    expect(THEME_DEFAULTS.info).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
