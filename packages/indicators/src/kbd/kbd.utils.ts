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

  if (key) return matchesKey(e, key);

  return modifiers.has(e.key);
}

function matchesKey(e: KeyboardEvent, key: string) {
  // The space bar's `event.key` is " ", and macOS Option+Space types U+00A0.
  if (key === "space") return e.key === " " || e.code === "Space";
  if (e.key.toLowerCase() === key) return true;

  // A held modifier can change `event.key` (macOS Option+B gives "∫"), so match
  // letters and digits on the physical key. Skip this when `event.key` is itself
  // a letter or digit, so a remapped layout (Dvorak Cmd+T is code KeyK) can't
  // light the key at its QWERTY position.
  const modified = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;
  if (!modified) return false;
  if (/^[a-z0-9]$/i.test(e.key)) return false;
  if (/^[a-z]$/.test(key)) return e.code === `Key${key.toUpperCase()}`;
  if (/^[0-9]$/.test(key)) return e.code === `Digit${key}`;
  return false;
}

export function formatKeys(keys: string[]) {
  return keys
    .map((k) => KEY_SYMBOLS[k.toLowerCase()] ?? k.toUpperCase())
    .join(" + ");
}
