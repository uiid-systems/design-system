import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { PRESET_COOKIE, isPresetName, type PresetName } from "./theme-presets";

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

/**
 * Read the preset name from the request cookie.
 */
export async function getServerPreset(): Promise<PresetName> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PRESET_COOKIE)?.value ?? "default";
  return isPresetName(value) ? value : "default";
}
