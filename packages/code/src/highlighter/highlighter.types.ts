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

/**
 * A language name as written by a caller, such as a markdown fence. Bundled
 * languages autocomplete; aliases resolve to one, and any other name renders
 * as plain, uncolored code.
 */
export type CodeLanguage = BundledLanguage | (string & {});

export type HighlightOptions = {
  /** Lines to highlight, 1-indexed */
  highlightLines?: number[];
};

export type HighlightResult = {
  html: string;
  loading: boolean;
  error: Error | null;
};
