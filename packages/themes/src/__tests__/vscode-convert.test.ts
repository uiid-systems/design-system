import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { convertVscodeTheme } from "../vscode/convert";
import { stripJsonc } from "../vscode/strip-jsonc";
import { ThemeInputSchema } from "../schema/theme-input";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fixture(name: string): string {
  return readFileSync(
    resolve(__dirname, `fixtures/${name}`),
    "utf-8",
  );
}

// ---------------------------------------------------------------------------
// stripJsonc
// ---------------------------------------------------------------------------

describe("stripJsonc", () => {
  it("passes through valid JSON unchanged", () => {
    const input = '{"a": 1, "b": "hello"}';
    expect(JSON.parse(stripJsonc(input))).toEqual({ a: 1, b: "hello" });
  });

  it("removes line comments", () => {
    const input = `{
      // this is a comment
      "a": 1
    }`;
    expect(JSON.parse(stripJsonc(input))).toEqual({ a: 1 });
  });

  it("removes block comments", () => {
    const input = `{
      /* block comment */
      "a": 1
    }`;
    expect(JSON.parse(stripJsonc(input))).toEqual({ a: 1 });
  });

  it("removes trailing commas", () => {
    const input = `{
      "a": 1,
      "b": [1, 2, 3,],
    }`;
    expect(JSON.parse(stripJsonc(input))).toEqual({ a: 1, b: [1, 2, 3] });
  });

  it("preserves // inside strings", () => {
    const input = '{"url": "https://example.com"}';
    expect(JSON.parse(stripJsonc(input))).toEqual({
      url: "https://example.com",
    });
  });

  it("handles mixed comments and trailing commas", () => {
    const input = `{
      // Name of the theme
      "name": "Test",
      /* Primary color */
      "color": "#ff0000",
    }`;
    expect(JSON.parse(stripJsonc(input))).toEqual({
      name: "Test",
      color: "#ff0000",
    });
  });
});

// ---------------------------------------------------------------------------
// convertVscodeTheme — core behavior
// ---------------------------------------------------------------------------

describe("convertVscodeTheme", () => {
  it("converts a dark theme object", () => {
    const { theme, warnings } = convertVscodeTheme({
      name: "My Dark Theme",
      type: "dark",
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "focusBorder": "#007acc",
        "badge.background": "#4d78cc",
        "terminal.ansiGreen": "#23d18b",
        "terminal.ansiYellow": "#f5f543",
        "terminal.ansiRed": "#f14c4c",
        "terminal.ansiBlue": "#3b8eea",
      },
    });

    expect(theme.name).toBe("My Dark Theme");
    expect(theme.white).toBe("#d4d4d4");
    expect(theme.black).toBe("#1e1e1e");
    expect(theme.primary).toBe("#007acc");
    expect(theme.secondary).toBe("#4d78cc");
    expect(theme.positive).toBe("#23d18b");
    expect(theme.warning).toBe("#f5f543");
    expect(theme.critical).toBe("#f14c4c");
    expect(theme.info).toBe("#3b8eea");

    // Output should be valid UIID theme input
    expect(ThemeInputSchema.safeParse(theme).success).toBe(true);
  });

  it("converts a light theme object", () => {
    const { theme } = convertVscodeTheme({
      name: "My Light Theme",
      type: "light",
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#333333",
        "focusBorder": "#0066cc",
        "terminal.ansiGreen": "#008000",
        "terminal.ansiRed": "#cc0000",
      },
    });

    expect(theme.white).toBe("#ffffff");
    expect(theme.black).toBe("#333333");
    expect(theme.primary).toBe("#0066cc");
    expect(ThemeInputSchema.safeParse(theme).success).toBe(true);
  });

  it("allows name override via options", () => {
    const { theme } = convertVscodeTheme(
      { name: "Original", type: "dark", colors: { "editor.background": "#000000", "editor.foreground": "#ffffff", "focusBorder": "#0000ff" } },
      { name: "Overridden" },
    );
    expect(theme.name).toBe("Overridden");
  });

  it("accepts raw JSONC string input", () => {
    const jsonc = `{
      // VSCode theme
      "name": "JSONC Theme",
      "type": "dark",
      "colors": {
        "editor.background": "#1a1a2e",
        "editor.foreground": "#e0e0e0",
        "focusBorder": "#5555ff",
      },
    }`;

    const { theme } = convertVscodeTheme(jsonc);
    expect(theme.name).toBe("JSONC Theme");
    expect(theme.primary).toBe("#5555ff");
    expect(ThemeInputSchema.safeParse(theme).success).toBe(true);
  });

  it("normalizes 8-digit hex (strips alpha)", () => {
    const { theme } = convertVscodeTheme({
      name: "Alpha Theme",
      type: "dark",
      colors: {
        "editor.background": "#282a36ff",
        "editor.foreground": "#f8f8f2ff",
        "focusBorder": "#6272a4cc",
      },
    });

    expect(theme.black).toBe("#282a36");
    expect(theme.white).toBe("#f8f8f2");
    expect(theme.primary).toBe("#6272a4");
  });

  it("detects dark theme from background luminance when type is missing", () => {
    const { theme } = convertVscodeTheme({
      name: "No Type",
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#cccccc",
        "focusBorder": "#ff0000",
      },
    });

    // Dark theme: white = foreground, black = background
    expect(theme.white).toBe("#cccccc");
    expect(theme.black).toBe("#1e1e1e");
  });

  it("detects light theme from background luminance when type is missing", () => {
    const { theme } = convertVscodeTheme({
      name: "No Type Light",
      colors: {
        "editor.background": "#f5f5f5",
        "editor.foreground": "#222222",
        "focusBorder": "#0000ff",
      },
    });

    expect(theme.white).toBe("#f5f5f5");
    expect(theme.black).toBe("#222222");
  });

  it("warns about include directive", () => {
    const { warnings } = convertVscodeTheme({
      name: "Extending Theme",
      type: "dark",
      include: "./base-theme.json",
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#ffffff",
        "focusBorder": "#ff0000",
      },
    });

    expect(warnings.some((w) => w.includes("include"))).toBe(true);
  });

  it("warns and falls back when no accent colors found", () => {
    const { theme, warnings } = convertVscodeTheme({
      name: "Bare Theme",
      type: "dark",
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#ffffff",
      },
    });

    expect(theme.primary).toBeDefined();
    expect(warnings.some((w) => w.includes("primary"))).toBe(true);
    expect(ThemeInputSchema.safeParse(theme).success).toBe(true);
  });

  it("warns and falls back when neutral colors are missing", () => {
    const { theme, warnings } = convertVscodeTheme({
      name: "No Colors",
      type: "dark",
      colors: {},
    });

    expect(theme.white).toBe("#ffffff");
    expect(theme.black).toBe("#000000");
    expect(warnings.some((w) => w.includes("white"))).toBe(true);
    expect(warnings.some((w) => w.includes("black"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// convertVscodeTheme — fixture tests (popular themes)
// ---------------------------------------------------------------------------

describe("convertVscodeTheme — fixtures", () => {
  it.each([
    ["vscode-dracula.json", "Dracula", "dark"],
    ["vscode-solarized-light.json", "Solarized Light", "light"],
    ["vscode-one-dark-pro.json", "One Dark Pro", "dark"],
    ["vscode-github-light.json", "GitHub Light Default", "light"],
    ["vscode-catppuccin-mocha.json", "Catppuccin Mocha", "dark"],
  ] as const)("converts %s into a valid UIID theme", (file, expectedName, mode) => {
    const raw = fixture(file);
    const { theme, warnings } = convertVscodeTheme(raw);

    // Name matches
    expect(theme.name).toBe(expectedName);

    // Output is valid UIID theme input
    const parsed = ThemeInputSchema.safeParse(theme);
    expect(parsed.success).toBe(true);

    // Required fields are present and are proper hex
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    expect(theme.white).toMatch(hexPattern);
    expect(theme.black).toMatch(hexPattern);
    expect(theme.primary).toMatch(hexPattern);
    expect(theme.secondary).toMatch(hexPattern);

    // Neutral anchors make sense for the theme mode
    const whiteR = parseInt(theme.white.slice(1, 3), 16);
    const blackR = parseInt(theme.black.slice(1, 3), 16);
    if (mode === "dark") {
      expect(whiteR).toBeGreaterThan(blackR);
    } else {
      expect(whiteR).toBeGreaterThan(blackR);
    }

    // No critical warnings (warnings are OK, errors are not)
    for (const w of warnings) {
      expect(w).not.toContain("ERROR");
    }
  });
});
