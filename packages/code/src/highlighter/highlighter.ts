import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerMetaHighlight,
} from "@shikijs/transformers";
import { createHighlighterCore } from "shiki/core";
import type { HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import {
  DEFAULT_THEME_DARK,
  DEFAULT_THEME_LIGHT,
  LANGUAGE_ALIASES,
  PLAIN_LANGUAGE,
  TOKENIZE_MAX_LINE_LENGTH,
} from "./highlighter.constants";
import type {
  BundledLanguage,
  CodeLanguage,
  HighlightOptions,
} from "./highlighter.types";

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
const THEME_DARK = () => import("@shikijs/themes/vitesse-black");
const THEME_LIGHT = () => import("@shikijs/themes/vitesse-light");

// Singleton state
let highlighterInstance: HighlighterCore | null = null;
let highlighterPromise: Promise<HighlighterCore> | null = null;
const loadedLanguages = new Set<BundledLanguage>();

/**
 * Get or create the shared highlighter instance. Only `highlight()` applies
 * the tokenize limits; calling this instance directly gets Shiki's defaults.
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
 * Resolve a language name to the bundled language that highlights it: the name
 * itself, or the target of an alias such as `ts` or `sh`. Case is ignored.
 * Returns `undefined` for any other name, and for no name at all, both of
 * which render as plain code.
 */
export function resolveLanguage(
  language: CodeLanguage | null | undefined,
): BundledLanguage | undefined {
  if (typeof language !== "string") {
    return undefined;
  }
  const name = language.toLowerCase();
  if (isSupportedLanguage(name)) {
    return name;
  }
  return Object.hasOwn(LANGUAGE_ALIASES, name)
    ? LANGUAGE_ALIASES[name]
    : undefined;
}

/**
 * Load a language into the highlighter. Aliases load the language they resolve
 * to; a name with no bundled grammar loads nothing.
 */
export async function loadLanguage(language: CodeLanguage): Promise<void> {
  const resolved = resolveLanguage(language);
  if (resolved) {
    await loadBundledLanguage(resolved);
  }
}

async function loadBundledLanguage(language: BundledLanguage): Promise<void> {
  if (loadedLanguages.has(language)) {
    return;
  }

  const highlighter = await getHighlighter();
  const langModule = await BUNDLED_LANGS[language]();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await highlighter.loadLanguage(langModule as any);
  loadedLanguages.add(language);
}

/**
 * Highlight code with the given language. A language with no bundled grammar
 * falls back to plain, uncolored code rather than failing.
 * Uses dual themes for automatic light/dark switching via CSS variables.
 * Transformers enable diff/highlight notations (`// [!code ++]`, etc.) and
 * meta-string line highlighting (built from options.highlightLines).
 */
export async function highlight(
  code: string,
  language: CodeLanguage = "typescript",
  options: HighlightOptions = {},
): Promise<string> {
  const resolved = resolveLanguage(language);
  if (resolved) {
    await loadBundledLanguage(resolved);
  }
  const highlighter = await getHighlighter();

  const { highlightLines } = options;
  const meta = highlightLines?.length
    ? { __raw: `{${highlightLines.join(",")}}` }
    : undefined;

  return highlighter.codeToHtml(code, {
    lang: resolved ?? PLAIN_LANGUAGE,
    themes: {
      light: DEFAULT_THEME_LIGHT,
      dark: DEFAULT_THEME_DARK,
    },
    defaultColor: false,
    // Shiki stops tokenizing a line after 500ms by default and leaves the rest
    // of it one color. A first highlight on a slow device can cross that, and
    // the block never re-highlights, so 0 turns the limit off. The trade-off:
    // nothing then bounds the time for one line, so a length cap does instead,
    // and a line at or past it renders plain every time.
    tokenizeTimeLimit: 0,
    tokenizeMaxLineLength: TOKENIZE_MAX_LINE_LENGTH,
    ...(meta && { meta }),
    transformers: [
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerMetaHighlight(),
    ],
  });
}

/**
 * Check if a language is bundled. Aliases are not: use `resolveLanguage` to
 * find the bundled language an alias maps to.
 * Case-sensitive, unlike `resolveLanguage`: `"TypeScript"` is not supported.
 */
export function isSupportedLanguage(
  language: string,
): language is BundledLanguage {
  return Object.hasOwn(BUNDLED_LANGS, language);
}

/**
 * Get list of supported languages
 */
export function getSupportedLanguages(): BundledLanguage[] {
  return Object.keys(BUNDLED_LANGS) as BundledLanguage[];
}
