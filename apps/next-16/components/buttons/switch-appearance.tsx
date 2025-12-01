"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { ToggleButton } from "@uiid/buttons";
import { Sun, Moon } from "@uiid/icons";

function getSnapshot() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

export function SwitchAppearance() {
  // Use useSyncExternalStore to sync with system color scheme preference
  const systemPrefersDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Track user's manual override
  const [userPreference, setUserPreference] = useState<boolean | null>(null);

  // Use user preference if set, otherwise follow system preference
  const isDarkMode = userPreference ?? systemPrefersDark;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setUserPreference(!isDarkMode);
  };

  return (
    <ToggleButton
      pressed={isDarkMode}
      onClick={handleToggleDarkMode}
      icon={{ pressed: <Sun />, unpressed: <Moon /> }}
      variant="subtle"
      tooltip="Toggle appearance"
      size="sm"
      square
      style={
        {
          "--button-height": "var(--forms-size-sm-height)",
        } as React.CSSProperties
      }
    />
  );
}
