import type { CodeLanguage } from "../highlighter/highlighter.types";

export type CodeInlineProps = React.ComponentProps<"code"> & {
  /** Programming language for syntax highlighting (optional) */
  language?: CodeLanguage;
  /** Pre-highlighted HTML for SSR */
  html?: string;
};
