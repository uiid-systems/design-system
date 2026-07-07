"use client";

import { ToggleGroup, Toggle } from "@uiid/design-system";
import { SunIcon, MoonIcon, MonitorIcon } from "@uiid/icons";

import { useColorScheme, type ColorScheme } from "@/hooks/use-color-scheme";

export const ModeToggle = () => {
  const { scheme, setColorScheme } = useColorScheme();

  return (
    <ToggleGroup
      data-slot="mode-toggle"
      size="sm"
      value={[scheme]}
      onValueChange={(value) => {
        // Ignore deselect (empty array); the control always keeps one active.
        const next = value[0] as ColorScheme | undefined;
        if (next) setColorScheme(next);
      }}
    >
      <Toggle value="light" aria-label="Light theme">
        <SunIcon />
      </Toggle>
      <Toggle value="dark" aria-label="Dark theme">
        <MoonIcon />
      </Toggle>
      <Toggle value="system" aria-label="System theme">
        <MonitorIcon />
      </Toggle>
    </ToggleGroup>
  );
};
ModeToggle.displayName = "ModeToggle";
