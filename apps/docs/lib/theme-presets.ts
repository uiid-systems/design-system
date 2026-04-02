export type PresetName =
  | "default"
  | "ayu"
  | "ocean"
  | "ember"
  | "dracula"
  | "catppuccin"
  | "github";

export const PRESET_COOKIE = "uiid-preset";

const VALID_PRESETS: PresetName[] = [
  "default",
  "ayu",
  "ocean",
  "ember",
  "dracula",
  "catppuccin",
  "github",
];

export function isPresetName(value: string): value is PresetName {
  return VALID_PRESETS.includes(value as PresetName);
}
