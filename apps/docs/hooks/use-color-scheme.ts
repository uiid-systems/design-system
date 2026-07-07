"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export type ColorScheme = "light" | "dark" | "system";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** localStorage key shared with the inline pre-paint script in the root layout. */
export const COLOR_SCHEME_STORAGE_KEY = "uiid-theme";

/**
 * The theme system is driven entirely by CSS `light-dark()` gated on
 * `color-scheme`. Setting `data-theme` on <html> pins the scheme:
 *   - "light" / "dark" → `color-scheme: light | dark`
 *   - "system"         → attribute removed → `color-scheme: light dark`
 * (see packages/tokens/src/globals.css)
 */
const readScheme = (): ColorScheme => {
  if (typeof document === "undefined") return "system";
  const attr = document.documentElement.dataset.theme;
  return attr === "light" || attr === "dark" ? attr : "system";
};

const applyScheme = (scheme: ColorScheme) => {
  const root = document.documentElement;
  if (scheme === "system") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = scheme;
  }
};

export const useColorScheme = () => {
  // Server can't know the stored preference, so it renders "system". The
  // pre-paint script has already applied the real value to <html>, and this
  // effect syncs React state to it on mount — no visible hydration mismatch.
  const [scheme, setScheme] = useState<ColorScheme>("system");

  // Reconcile to the real stored preference after hydration but before paint,
  // so the toggle's first painted frame already shows the correct selection.
  useIsomorphicLayoutEffect(() => {
    setScheme(readScheme());
  }, []);

  const setColorScheme = useCallback((next: ColorScheme) => {
    setScheme(next);
    applyScheme(next);
    try {
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (private mode, disabled storage, etc.).
    }
  }, []);

  return { scheme, setColorScheme };
};
