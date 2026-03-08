"use client";

import { useTransition } from "react";
import { Select } from "@uiid/forms";

import { generateThemeCSS } from "@/app/actions/generate-theme";
import { useThemePreset, injectPresetCSS, type PresetName } from "@/lib/use-theme-preset";

const PRESET_ITEMS = [
  { label: "Default", value: "default" },
  { label: "Ayu", value: "ayu" },
  { label: "Ocean", value: "ocean" },
  { label: "Ember", value: "ember" },
];

export const ThemeSelector = ({ initialPreset }: { initialPreset?: PresetName }) => {
  const { preset, setPreset } = useThemePreset(initialPreset);
  const [, startTransition] = useTransition();

  const handleChange = (value: string | null) => {
    if (!value) return;
    const name = value as PresetName;
    setPreset(name);

    if (name === "default") {
      injectPresetCSS(null);
      return;
    }

    startTransition(async () => {
      const result = await generateThemeCSS(name);
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
