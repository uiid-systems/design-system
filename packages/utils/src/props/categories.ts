export const PROP_CATEGORIES = [
  "core",
  "spacing",
  "layout",
  "sizing",
  "border",
  "toggle",
  "subcomponent",
] as const;

export type PropCategory = (typeof PROP_CATEGORIES)[number];

/**
 * Known toggle prop names (boolean variant flags).
 * These are props that enable specific component behaviors.
 */
export const togglePropKeys = [
  "evenly",
  "fullwidth",
  "fullheight",
  "fullscreen",
] as const;
