import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { HighlighterCore } from "shiki/core";

import type { BundledLanguage } from "./highlighter.types";

// Lazy-loaded bundled languages
const BUNDLED_LANGS: Record<BundledLanguage, () => Promise<unknown>> = {
  javascript: () => import("@shikijs/langs/javascript"),
  typescript: () => import("@shikijs/langs/typescript"),
  jsx: () => import("@shikijs/langs/jsx"),
  tsx: () => import("@shikijs/langs/tsx"),
  json: () => import("@shikijs/langs/json"),
  css: () => import("@shikijs/langs/css"),
  html: () => import("@shikijs/langs/html"),
  bash: () => import("@shikijs/langs/bash"),
  markdown: () => import("@shikijs/langs/markdown"),
  python: () => import("@shikijs/langs/python"),
};

// Themes - Vitesse for light/dark mode support
const THEME_DARK = () => import("@shikijs/themes/vitesse-dark");
const THEME_LIGHT = () => import("@shikijs/themes/vitesse-light");

export const DEFAULT_THEME_DARK = "vitesse-dark";
export const DEFAULT_THEME_LIGHT = "vitesse-light";

// Singleton state
let highlighterInstance: HighlighterCore | null = null;
let highlighterPromise: Promise<HighlighterCore> | null = null;
const loadedLanguages = new Set<BundledLanguage>();

/**
 * Get or create the shared highlighter instance
 */
export async function getHighlighter(): Promise<HighlighterCore> {
  if (highlighterInstance) {
    return highlighterInstance;
  }

  if (highlighterPromise) {
    return highlighterPromise;
  }

  highlighterPromise = createHighlighterCore({
    themes: [THEME_DARK, THEME_LIGHT],
    langs: [],
    engine: createJavaScriptRegexEngine(),
  });

  highlighterInstance = await highlighterPromise;
  return highlighterInstance;
}

/**
 * Load a language into the highlighter
 */
export async function loadLanguage(language: BundledLanguage): Promise<void> {
  if (loadedLanguages.has(language)) {
    return;
  }

  const langLoader = BUNDLED_LANGS[language];
  if (!langLoader) {
    throw new Error(`Unknown language: ${language}`);
  }

  const highlighter = await getHighlighter();
  const langModule = await langLoader();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await highlighter.loadLanguage(langModule as any);
  loadedLanguages.add(language);
}

/**
 * Highlight code with the given language
 * Uses dual themes for automatic light/dark mode switching via CSS variables
 */
export async function highlight(
  code: string,
  language: BundledLanguage = "typescript"
): Promise<string> {
  await loadLanguage(language);
  const highlighter = await getHighlighter();

  return highlighter.codeToHtml(code, {
    lang: language,
    themes: {
      light: DEFAULT_THEME_LIGHT,
      dark: DEFAULT_THEME_DARK,
    },
    defaultColor: false,
  });
}

/**
 * Check if a language is supported
 */
export function isSupportedLanguage(
  language: string
): language is BundledLanguage {
  return language in BUNDLED_LANGS;
}

/**
 * Get list of supported languages
 */
export function getSupportedLanguages(): BundledLanguage[] {
  return Object.keys(BUNDLED_LANGS) as BundledLanguage[];
}
