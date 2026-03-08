"use server";

import { getPresetCSS } from "@/lib/get-preset-css";

/**
 * Server Action: return pre-built theme CSS for a given preset name.
 */
export async function generateThemeCSS(
  presetName: string
): Promise<{ css: string } | { error: string }> {
  const css = getPresetCSS(presetName);

  if (!css) {
    return { error: `Unknown theme preset: ${presetName}` };
  }

  return { css };
}
