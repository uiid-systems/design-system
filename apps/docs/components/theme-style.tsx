import { cookies } from "next/headers";

import { getPresetCSS } from "@/lib/get-preset-css";
import { PRESET_COOKIE, isPresetName, type PresetName } from "@/lib/theme-presets";

async function getServerPreset(): Promise<PresetName> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PRESET_COOKIE)?.value ?? "default";
  return isPresetName(value) ? value : "default";
}

export async function ThemeStyle() {
  const presetName = await getServerPreset();
  const presetCSS = getPresetCSS(presetName);

  if (!presetCSS) return null;

  return (
    <style
      id="uiid-theme-preset-style"
      dangerouslySetInnerHTML={{ __html: presetCSS }}
    />
  );
}

export { getServerPreset };
