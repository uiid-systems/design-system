import type { BundledLanguage } from "./highlighter.types";

export const DEFAULT_THEME_DARK = "vitesse-black";
export const DEFAULT_THEME_LIGHT = "vitesse-light";

/**
 * Shiki's built-in plain language. It needs no grammar: the code keeps the
 * same line markup and transformers, with no token colors.
 */
export const PLAIN_LANGUAGE = "text";

/** Common fence names that map onto a bundled language. */
export const LANGUAGE_ALIASES: Readonly<Record<string, BundledLanguage>> = {
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  py: "python",
  md: "markdown",
};
