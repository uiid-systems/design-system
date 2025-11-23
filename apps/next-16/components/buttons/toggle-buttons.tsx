"use client";

import { useEffect, useState } from "react";

import { ToggleButton } from "@uiid/buttons";
import { Sun, Moon } from "@uiid/icons";
import { Group } from "@uiid/layout";

export function ToggleButtons() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if window is defined (for client-side execution)
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(mediaQuery.matches);

      const handleChange = (event: MediaQueryListEvent) => {
        setIsDarkMode(event.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Group gap={2}>
      <ToggleButton
        pressed={isDarkMode}
        onClick={handleToggleDarkMode}
        icon={{ pressed: <Sun />, unpressed: <Moon /> }}
        variant="subtle"
      />
      <ToggleButton
        pressed={isDarkMode}
        onClick={handleToggleDarkMode}
        icon={{ pressed: <Sun />, unpressed: <Moon /> }}
        iconPosition="after"
        variant="subtle"
      >
        Toggle theme
      </ToggleButton>
      <ToggleButton
        onClick={handleToggleDarkMode}
        text={{ pressed: "Dark Mode", unpressed: "Light Mode" }}
        icon={{ pressed: <Sun />, unpressed: <Moon /> }}
        iconPosition="after"
        variant="subtle"
      >
        Light Mode
      </ToggleButton>
    </Group>
  );
}
