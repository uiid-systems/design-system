import type { BundledLanguage } from "../highlighter/highlighter.types";

export const DEFAULT_LANGUAGE: BundledLanguage = "typescript";
export const DEFAULT_TAB_SIZE = 2;
export const DEFAULT_INSERT_SPACES = true;
export const DEFAULT_SHOW_LINE_NUMBERS = false;
export const DEFAULT_COPYABLE = true;
export const DEFAULT_CODE = "";

/** Comment prefixes by language */
export const COMMENT_PREFIXES: Partial<Record<BundledLanguage, string>> = {
  javascript: "//",
  typescript: "//",
  jsx: "//",
  tsx: "//",
  python: "#",
  bash: "#",
  css: "/*",
  html: "<!--",
  json: "//",
  markdown: "<!--",
};

/** Comment suffixes for languages that need closing */
export const COMMENT_SUFFIXES: Partial<Record<BundledLanguage, string>> = {
  css: " */",
  html: " -->",
  markdown: " -->",
};
