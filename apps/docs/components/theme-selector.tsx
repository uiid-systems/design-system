"use client";

import { useTransition } from "react";
import { Select } from "@uiid/forms";

import { generateThemeCSS } from "@/app/actions/generate-theme";
import { useThemePreset, injectPresetCSS, type PresetName } from "@/lib/use-theme-preset";

import type { ThemeInput } from "@uiid/themes/schema";

const PRESETS: Record<PresetName, ThemeInput> = {
  default: {
    name: "Default",
    white: "#fefefa",
    black: "#0d0d0d",
    primary: "#f9262a",
    secondary: "#9036e1",
  },
  ayu: {
    name: "Ayu",
    white: "#fcfcfc",
    black: "#1a1f29",
    primary: "#d06818",
    secondary: "#2b7cb5",
    positive: "#5c7a00",
    warning: "#b07a00",
    critical: "#c74545",
    info: "#2d8aab",
  },
  ocean: {
    name: "Ocean",
    white: "#f0f4f8",
    black: "#0a1628",
    primary: "#0077cc",
    secondary: "#6b5ce7",
  },
  ember: {
    name: "Ember",
    white: "#fdf6f0",
    black: "#1a0e05",
    primary: "#e05a1a",
    secondary: "#c4362a",
  },
};

const PRESET_ITEMS = [
  { label: "Default", value: "default" },
  { label: "Ayu", value: "ayu" },
  { label: "Ocean", value: "ocean" },
  { label: "Ember", value: "ember" },
];

export const ThemeSelector = () => {
  const { preset, setPreset } = useThemePreset();
  const [, startTransition] = useTransition();

  const handleChange = (value: string | null) => {
    if (!value) return;
    const name = value as PresetName;
    setPreset(name);
    startTransition(async () => {
      const result = await generateThemeCSS(PRESETS[name]);
      if ("error" in result) {
        console.error(result.error);
        return;
      }
      injectPresetCSS(result.css);
    });
  };

  return (
    <Select
      value={preset}
      onValueChange={handleChange}
      items={PRESET_ITEMS}
      size="small"
      ghost
    />
  );
};
ThemeSelector.displayName = "ThemeSelector";
