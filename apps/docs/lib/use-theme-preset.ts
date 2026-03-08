"use client";

import { useState, useCallback } from "react";
import { PRESET_COOKIE, type PresetName } from "./theme-presets";

export type { PresetName };

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

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function useThemePreset(initialPreset: PresetName = "default") {
  const [preset, setPresetState] = useState<PresetName>(initialPreset);

  const setPreset = useCallback((name: PresetName) => {
    setPresetState(name);
    setCookie(PRESET_COOKIE, name);
  }, []);

  return { preset, setPreset } as const;
}
