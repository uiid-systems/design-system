"use client";

import { ToggleButton } from "@uiid/buttons";
import { Moon, Sun } from "@uiid/icons";

import { useTheme } from "@/lib/use-theme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton
      pressed={theme === "light"}
      onPressedChange={toggleTheme}
      icon={{
        pressed: <Sun />,
        unpressed: <Moon />,
      }}
      variant="ghost"
      size="xsmall"
      shape="square"
      tooltip={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    />
  );
};
ThemeToggle.displayName = "ThemeToggle";
