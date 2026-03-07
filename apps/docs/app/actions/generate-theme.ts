"use server";

import path from "path";
import { ThemeInputSchema, THEME_DEFAULTS } from "@uiid/themes/schema";
import { buildOverrides, collectDerivedOverrides, generateCss } from "@uiid/themes/generator";
import type { ThemeInput } from "@uiid/themes/schema";

/**
 * Server Action: generate theme CSS from a ThemeInput.
 *
 * Runs the full derivation pipeline on the server and returns a CSS string.
 * Used for on-the-fly theme creation in the theme selector.
 */
export async function generateThemeCSS(
  input: ThemeInput
): Promise<{ css: string } | { error: string }> {
  const result = ThemeInputSchema.safeParse(input);
  if (!result.success) {
    const messages = result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`
    );
    return { error: `Invalid theme input: ${messages.join(", ")}` };
  }

  try {
    // Dynamic import to keep TokenGenerator out of the client bundle
    const { default: TokenGenerator } = await import(
      /* webpackIgnore: true */
      path.join(process.cwd(), "../../scripts/generate-tokens.js")
    );

    const generator = new TokenGenerator({ force: true });
    const jsonFiles = generator.discoverJsonFiles(generator.jsonDir);
    generator.buildRegistry(jsonFiles);

    const theme = result.data;
    const overrides = buildOverrides(theme);
    const overriddenPaths = new Set(overrides.keys());
    generator.applyOverrides(overrides);

    const directOverrides = new Map<string, string>();
    directOverrides.set("--theme-white", theme.white);
    directOverrides.set("--theme-black", theme.black);
    directOverrides.set("--theme-primary", theme.primary);
    directOverrides.set("--theme-secondary", theme.secondary);
    directOverrides.set("--theme-positive", theme.positive ?? THEME_DEFAULTS.positive);
    directOverrides.set("--theme-warning", theme.warning ?? THEME_DEFAULTS.warning);
    directOverrides.set("--theme-critical", theme.critical ?? THEME_DEFAULTS.critical);
    directOverrides.set("--theme-info", theme.info ?? THEME_DEFAULTS.info);

    const derivedOverrides = collectDerivedOverrides(generator, overriddenPaths);
    const css = generateCss(theme.name, directOverrides, derivedOverrides);

    return { css };
  } catch (err) {
    return { error: `Theme generation failed: ${(err as Error).message}` };
  }
}
