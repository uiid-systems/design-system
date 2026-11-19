import type { BundledLanguage } from "./highlighter.types";

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

/**
 * Lines at or past this length render plain. With Shiki's per-line time limit
 * off, this is what bounds a long line such as minified JSON.
 */
export const TOKENIZE_MAX_LINE_LENGTH = 10_000;
