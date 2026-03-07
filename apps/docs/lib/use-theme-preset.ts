"use client";

import { useState } from "react";

export type PresetName = "default" | "ayu" | "ocean" | "ember";

const STYLE_ID = "uiid-theme-preset-style";

/**
 * Inject or update the theme preset CSS in a <style> tag.
 * Passing null removes the override (falls back to static CSS import).
 */
export function injectPresetCSS(css: string | null) {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (css === null) {
    style?.remove();
    return;
  }

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = css;
}

export function useThemePreset() {
  const [preset, setPreset] = useState<PresetName>("default");
  return { preset, setPreset } as const;
}
