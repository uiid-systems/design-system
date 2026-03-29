import { KEY_SYMBOLS, MODIFIER_KEYS } from "./kbd.constants";

export function parseHotkey(keys: string[]) {
  const modifiers = new Set<string>();
  let key = "";

  for (const k of keys) {
    const lower = k.toLowerCase();
    if (MODIFIER_KEYS[lower]) modifiers.add(MODIFIER_KEYS[lower]);
    else key = lower;
  }

  return { modifiers, key };
}

export function matchesHotkey(e: KeyboardEvent, keys: string[]) {
  const { modifiers, key } = parseHotkey(keys);

  if (modifiers.has("Meta") !== e.metaKey) return false;
  if (modifiers.has("Control") !== e.ctrlKey) return false;
  if (modifiers.has("Alt") !== e.altKey) return false;
  if (modifiers.has("Shift") !== e.shiftKey) return false;

  if (key) return e.key.toLowerCase() === key;

  return modifiers.has(e.key);
}

export function formatKeys(keys: string[]) {
  return keys
    .map((k) => KEY_SYMBOLS[k.toLowerCase()] ?? k.toUpperCase())
    .join(" + ");
}
