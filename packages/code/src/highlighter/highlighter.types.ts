import type { HighlighterCore } from "shiki/core";

export type BundledLanguage =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "json"
  | "css"
  | "html"
  | "bash"
  | "markdown"
  | "python";

export type HighlighterState = {
  highlighter: HighlighterCore | null;
  loading: boolean;
  error: Error | null;
  loadedLanguages: Set<BundledLanguage>;
};

export type HighlightOptions = {
  language?: BundledLanguage;
};

export type HighlightResult = {
  html: string;
  loading: boolean;
  error: Error | null;
};
