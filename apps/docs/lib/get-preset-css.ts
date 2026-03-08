import fs from "fs";
import path from "path";

const PRESET_CSS_DIR = path.resolve(
  process.cwd(),
  "../../packages/themes/src/presets/css"
);

/**
 * Read pre-built theme CSS for a preset name.
 * Returns null for "default" (no override needed) or unknown presets.
 */
export function getPresetCSS(presetName: string): string | null {
  if (presetName === "default") return null;

  const safeName = presetName.replace(/[^a-z0-9-]/gi, "");
  const cssPath = path.join(PRESET_CSS_DIR, `${safeName}.theme.css`);

  try {
    return fs.readFileSync(cssPath, "utf8");
  } catch {
    return null;
  }
}
