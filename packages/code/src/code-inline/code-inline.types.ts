import type { BundledLanguage } from "../highlighter/highlighter.types";

export type CodeInlineProps = React.ComponentProps<"code"> & {
  /** Programming language for syntax highlighting (optional) */
  language?: BundledLanguage;
  /** Pre-highlighted HTML for SSR */
  html?: string;
};
