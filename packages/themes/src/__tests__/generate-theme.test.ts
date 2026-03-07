import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../../..");

// Import the wrapper script which provides the TokenGenerator binding
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

    // Build a fresh generator with default JSON to get expected values
    const TokenGenerator = (
      await import(path.join(ROOT, "scripts/generate-tokens.js"))
    ).default;
    const gen = new TokenGenerator({ force: true });
    const jsonFiles = gen.discoverJsonFiles(gen.jsonDir);
    gen.buildRegistry(jsonFiles);

    // Count shade tokens in the registry to avoid a magic number
    const shadeKeys = [...gen.registry.keys()].filter((k: string) =>
      /^shade\.\d+$/.test(k)
    );

    // Verify each shade-N in the generated CSS matches the default registry
    const re = /--shade-(\d+):\s*(light-dark\(([^,]+),\s*([^)]+)\))/g;
    let m;
    let count = 0;
    while ((m = re.exec(css))) {
      const shadeKey = `shade.${m[1]}`;
      const generatedLight = m[3].trim();
      const generatedDark = m[4].trim();

      const expected = gen.resolveToHexPair(`{${shadeKey}}`);
      expect(generatedLight).toBe(expected.light);
      expect(generatedDark).toBe(expected.dark);
      count++;
    }
    expect(count).toBe(shadeKeys.length);
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

    expect(derivedOverrides.size).toBeGreaterThan(0);

    const shadeMatch = css.match(/--shade-1:\s*(light-dark\([^)]+\))/);
    expect(shadeMatch).not.toBeNull();
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

    expect(css).toContain(":root {");
    expect(css).toContain("}");

    const propLines = css
      .split("\n")
      .filter((l: string) => l.trim().startsWith("--"));
    for (const line of propLines) {
      expect(line).toMatch(/--[\w-]+:\s*.+;/);
    }

    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it("generates ayu theme with no contrast errors", async () => {
    const inputPath = path.join(
      __dirname,
      "../presets/ayu.theme.json"
    );
    const outputPath = path.join(TMP_DIR, "ayu.theme.css");

    const { warnings, css } = await generateTheme(inputPath, outputPath);

    const errors = warnings.filter((w: { level: string }) => w.level === "error");
    expect(errors).toEqual([]);

    expect(css).toContain("--theme-primary");
    expect(css).toContain("--shade-1");
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
