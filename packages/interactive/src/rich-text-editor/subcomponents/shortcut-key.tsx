import { Kbd } from "@uiid/indicators";

import { isMacOS } from "../rich-text-editor.utils";

export interface ShortcutKeyProps {
  keys: string[];
}

/** Map tiptap's "mod" key to the platform-specific key name used by Kbd. */
function normalizeKey(key: string): string {
  if (key.toLowerCase() === "mod") return isMacOS() ? "meta" : "ctrl";
  return key;
}

export const ShortcutKey = ({ keys }: ShortcutKeyProps) => {
  return <Kbd hotkey={keys.map(normalizeKey)} />;
};
ShortcutKey.displayName = "ShortcutKey";
