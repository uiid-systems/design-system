"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "uiid-theme";

function getSnapshot(): Theme | null {
  return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? null;
}

function getServerSnapshot(): Theme | null {
  return null;
}

function subscribe(callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const current = localStorage.getItem(STORAGE_KEY) as Theme | null;
    let next: Theme;
    if (current) {
      next = current === "light" ? "dark" : "light";
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      next = prefersDark ? "light" : "dark";
    }
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    // Trigger re-render by dispatching a storage event equivalent
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY, newValue: next }),
    );
  }, []);

  return { theme, toggleTheme } as const;
}
