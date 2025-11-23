"use client";

import { useEffect, useState } from "react";

import { ToggleButton } from "@uiid/buttons";
import { Sun, Moon } from "@uiid/icons";
import { Group } from "@uiid/layout";

export function ToggleButtons() {
  // Initialize to false on both server and client for consistent hydration
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // After hydration, sync with user's system preference
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // Set initial value based on system preference
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
