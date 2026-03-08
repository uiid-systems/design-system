"use server";

import fs from "fs";
import path from "path";

/** Map preset names to pre-built CSS files in @uiid/themes */
const PRESET_CSS_DIR = path.resolve(
  process.cwd(),
  "../../packages/themes/src/presets/css"
);

/**
 * Server Action: return pre-built theme CSS for a given preset name.
 */
export async function generateThemeCSS(
  presetName: string
): Promise<{ css: string } | { error: string }> {
  const safeName = presetName.replace(/[^a-z0-9-]/gi, "");
  const cssPath = path.join(PRESET_CSS_DIR, `${safeName}.theme.css`);

  try {
    const css = fs.readFileSync(cssPath, "utf8");
    return { css };
  } catch {
    return { error: `Unknown theme preset: ${presetName}` };
  }
}
