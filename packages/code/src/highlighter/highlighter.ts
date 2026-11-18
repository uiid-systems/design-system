import type { HighlighterCore } from "shiki/core";

import {
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

// Vitesse for light and dark. This is the only place a theme is named: the
// names `highlight()` asks Shiki for are read from the loaded themes.
const THEMES = {
  light: () => import("@shikijs/themes/vitesse-light"),
  dark: () => import("@shikijs/themes/vitesse-black"),
};

// Every call after the first load resolves to the same module, so this is
// cheap to call wherever the runtime is needed.
const loadRuntime = () => import("./highlighter.runtime");

// Singleton state
let highlighterInstance: HighlighterCore | null = null;
let highlighterPromise: Promise<HighlighterCore> | null = null;
let themeNames: { light: string; dark: string } | null = null;
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

  // The Shiki runtime loads on first use, so a page that never highlights
  // never downloads it. The themes are fetched alongside it, not after it.
  const promise = Promise.all([
    loadRuntime(),
    THEMES.dark(),
    THEMES.light(),
  ]).then(
    async ([
      { createHighlighterCore, createJavaScriptRegexEngine },
      dark,
      light,
    ]) => {
      const highlighter = await createHighlighterCore({
        themes: [dark, light],
        langs: [],
        engine: createJavaScriptRegexEngine(),
      });
      themeNames = { light: light.default.name!, dark: dark.default.name! };
      return highlighter;
    },
  );
  highlighterPromise = promise;

  try {
    highlighterInstance = await promise;
  } catch (error) {
    // Forget the failed load so the next call tries again, rather than every
    // later highlight failing with it.
    if (highlighterPromise === promise) {
      highlighterPromise = null;
    }
    throw error;
  }
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

  // Fetch the grammar alongside the highlighter, not after it.
  const [highlighter, langModule] = await Promise.all([
    getHighlighter(),
    BUNDLED_LANGS[language](),
  ]);
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
  const {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerMetaHighlight,
  } = await loadRuntime();

  const { highlightLines } = options;
  const meta = highlightLines?.length
    ? { __raw: `{${highlightLines.join(",")}}` }
    : undefined;

  return highlighter.codeToHtml(code, {
    lang: resolved ?? PLAIN_LANGUAGE,
    // Set once the highlighter above has loaded the themes.
    themes: themeNames!,
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
