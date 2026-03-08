import { getPresetCSS, getServerPreset } from "@/lib/get-preset-css";

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
