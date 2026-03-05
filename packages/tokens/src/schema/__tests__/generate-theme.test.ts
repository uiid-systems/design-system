import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../../../..");

// Dynamic import since generate-theme.js is ESM
const { generateTheme } = await import(
  path.join(ROOT, "scripts/generate-theme.js")
);

const TMP_DIR = path.join(ROOT, "node_modules/.cache/theme-test");

beforeAll(() => {
  fs.mkdirSync(TMP_DIR, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

function writeTheme(name: string, data: object): string {
  const p = path.join(TMP_DIR, `${name}.theme.json`);
  fs.writeFileSync(p, JSON.stringify(data), "utf8");
  return p;
}

describe("generate-theme", () => {
  it("round-trips default palette to matching shade hex values", async () => {
    const inputPath = writeTheme("default", {
      name: "Default",
      white: "#fefefa",
      black: "#0d0d0d",
      primary: "#f9262a",
      secondary: "#9036e1",
      positive: "#00c565",
      warning: "#e8b700",
      critical: "#f9262a",
      info: "#347eff",
    });
    const outputPath = path.join(TMP_DIR, "default.theme.css");

    const { css } = await generateTheme(inputPath, outputPath);

    // Read existing shade CSS from build output
    const existingShade = fs.readFileSync(
      path.join(ROOT, "packages/tokens/src/css/semantic/shade.tokens.css"),
      "utf8"
    );

    // Extract shade-N values from both
    const extractShades = (text: string) => {
      const map = new Map<string, string>();
      const re = /--shade-(\d+):\s*(light-dark\([^)]+\))/g;
      let m;
      while ((m = re.exec(text))) {
        map.set(`shade-${m[1]}`, m[2]);
      }
      return map;
    };

    const generated = extractShades(css);
    const existing = extractShades(existingShade);

    expect(generated.size).toBeGreaterThan(0);
    for (const [key, value] of generated) {
      expect(value).toBe(existing.get(key));
    }
  });

  it("produces different values for a custom palette", async () => {
    const inputPath = writeTheme("custom", {
      name: "Custom",
      white: "#f0f4f8",
      black: "#0a1628",
      primary: "#0077cc",
      secondary: "#6b5ce7",
    });
    const outputPath = path.join(TMP_DIR, "custom.theme.css");

    const { css, derivedOverrides } = await generateTheme(inputPath, outputPath);

    // Should have derived overrides
    expect(derivedOverrides.size).toBeGreaterThan(0);

    // Shade-1 should be different from default
    const shadeMatch = css.match(/--shade-1:\s*(light-dark\([^)]+\))/);
    expect(shadeMatch).not.toBeNull();
    // Default shade-1 light value is #f6f6f2
    expect(shadeMatch![1]).not.toContain("#f6f6f2");
  });

  it("produces syntactically valid CSS", async () => {
    const inputPath = writeTheme("syntax", {
      name: "Syntax Check",
      white: "#ffffff",
      black: "#000000",
      primary: "#3366cc",
      secondary: "#cc3366",
    });
    const outputPath = path.join(TMP_DIR, "syntax.theme.css");

    const { css } = await generateTheme(inputPath, outputPath);

    // Basic structural checks
    expect(css).toContain(":root {");
    expect(css).toContain("}");

    // Every line with -- should have a : and ;
    const propLines = css
      .split("\n")
      .filter((l) => l.trim().startsWith("--"));
    for (const line of propLines) {
      expect(line).toMatch(/--[\w-]+:\s*.+;/);
    }

    // File was written
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it("rejects invalid input", async () => {
    const inputPath = writeTheme("invalid", {
      name: "",
      white: "not-hex",
    });
    const outputPath = path.join(TMP_DIR, "invalid.theme.css");

    await expect(generateTheme(inputPath, outputPath)).rejects.toThrow(
      "Invalid theme input"
    );
  });
});
