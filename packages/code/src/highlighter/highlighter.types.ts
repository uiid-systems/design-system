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
   * The newest finished highlight. It can be for an earlier value than the
   * one passed in while a newer value is pending; `code` says which.
   */
  html: string;
  /**
   * The text `html` was highlighted from, and empty when there is no `html`.
   * Equal to the value passed in means `html` is current; otherwise `html`
   * covers an earlier value, and a newer highlight is pending or has failed
   * (see `error`). Compare with this, not `loading`.
   */
  code: string;
  /**
   * While enabled, true until the first result lands and again after
   * re-enabling. It is not set again when the value changes, so it does not
   * say whether `html` is current.
   */
  loading: boolean;
  error: Error | null;
};
