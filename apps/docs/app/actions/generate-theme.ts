"use server";

import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { ThemeInputSchema } from "@uiid/themes/schema";
import type { ThemeInput } from "@uiid/themes/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Server Action: generate theme CSS from a ThemeInput.
 *
 * Delegates to the generate-theme wrapper script which provides
 * the TokenGenerator binding.
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
    const { generateTheme } = await import(
      /* webpackIgnore: true */
      path.resolve(__dirname, "../../../../scripts/generate-theme.js")
    );

    const tmpInput = path.join(os.tmpdir(), `uiid-theme-${Date.now()}.json`);
    const tmpOutput = tmpInput.replace(/\.json$/, ".css");

    fs.writeFileSync(tmpInput, JSON.stringify(result.data), "utf8");

    try {
      const { css } = await generateTheme(tmpInput, tmpOutput);
      return { css };
    } finally {
      fs.rmSync(tmpInput, { force: true });
      fs.rmSync(tmpOutput, { force: true });
    }
  } catch (err) {
    return { error: `Theme generation failed: ${(err as Error).message}` };
  }
}
