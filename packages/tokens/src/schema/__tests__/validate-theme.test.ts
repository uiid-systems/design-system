import { describe, it, expect } from "vitest";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../../../..");

const { contrastRatio, validateThemeContrast } = await import(
  path.join(ROOT, "scripts/theme/validate.js")
);
const TokenGenerator = (
  await import(path.join(ROOT, "scripts/generate-tokens.js"))
).default;

describe("contrastRatio", () => {
  it("returns 21:1 for black on white", () => {
    const ratio = contrastRatio("#000000", "#ffffff");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 1:1 for identical colors", () => {
    const ratio = contrastRatio("#336699", "#336699");
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("is symmetric", () => {
    const a = contrastRatio("#ff0000", "#ffffff");
    const b = contrastRatio("#ffffff", "#ff0000");
    expect(a).toBeCloseTo(b, 5);
  });
});

describe("validateThemeContrast", () => {
  it("produces no errors for the default palette", async () => {
    const warnings = await validateThemeContrast(
      {
        name: "Default",
        white: "#fefefa",
        black: "#0d0d0d",
        primary: "#f9262a",
        secondary: "#9036e1",
        positive: "#00c565",
        warning: "#e8b700",
        critical: "#f9262a",
        info: "#347eff",
      },
      TokenGenerator
    );

    const errors = warnings.filter((w) => w.level === "error");
    expect(errors).toEqual([]);
  });

  it("flags low-contrast foreground/background", async () => {
    // Near-identical white and black → terrible contrast
    const warnings = await validateThemeContrast(
      {
        name: "Low Contrast",
        white: "#e0e0e0",
        black: "#c0c0c0",
        primary: "#d0d0d0",
        secondary: "#d5d5d5",
      },
      TokenGenerator
    );

    expect(warnings.length).toBeGreaterThan(0);
    const fgBg = warnings.find((w) => w.pair === "foreground / background");
    expect(fgBg).toBeDefined();
    expect(fgBg.ratio).toBeLessThan(4.5);
  });

  it("returns warnings with expected shape", async () => {
    const warnings = await validateThemeContrast(
      {
        name: "Shape Test",
        white: "#e0e0e0",
        black: "#c0c0c0",
        primary: "#d0d0d0",
        secondary: "#d5d5d5",
      },
      TokenGenerator
    );

    for (const w of warnings) {
      expect(w).toHaveProperty("level");
      expect(w).toHaveProperty("pair");
      expect(w).toHaveProperty("mode");
      expect(w).toHaveProperty("ratio");
      expect(w).toHaveProperty("required");
      expect(w).toHaveProperty("message");
      expect(["error", "warning"]).toContain(w.level);
      expect(["light", "dark"]).toContain(w.mode);
    }
  });
});
