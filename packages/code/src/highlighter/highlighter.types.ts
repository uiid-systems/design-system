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
  /**
   * Set to `false` to leave notation comments such as `// [!code ++]` in the
   * code as written, rather than turning them into line classes. An editor
   * needs this, since its highlight must hold exactly the text typed.
   * @default true
   */
  notations?: boolean;
};

export type HighlightResult = {
  html: string;
  loading: boolean;
  error: Error | null;
};
