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
  /**
   * The newest finished highlight. While `loading`, it can be for an earlier
   * value than the one passed in.
   */
  html: string;
  /**
   * The text `html` was highlighted from: the value passed in once `loading`
   * is false, an earlier one while a newer value is pending, and empty when
   * there is no `html`.
   */
  code: string;
  loading: boolean;
  error: Error | null;
};
