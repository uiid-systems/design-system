import type { BundledLanguage } from "../highlighter/highlighter.types";

export const DEFAULT_LANGUAGE: BundledLanguage = "typescript";
export const DEFAULT_SHOW_LINE_NUMBERS = false;
export const DEFAULT_COPYABLE = true;
export const DEFAULT_CODE = "";

export const LANGUAGE_DISPLAY_NAMES: Record<BundledLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  jsx: "JSX",
  tsx: "TSX",
  json: "JSON",
  css: "CSS",
  html: "HTML",
  bash: "Bash",
  markdown: "Markdown",
  python: "Python",
};
