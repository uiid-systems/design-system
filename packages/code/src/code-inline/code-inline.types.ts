import type { CodeLanguage } from "../highlighter/highlighter.types";

/** No `dangerouslySetInnerHTML`: CodeInline sets its own, from `html`. */
export type CodeInlineProps = Omit<
  React.ComponentProps<"code">,
  "dangerouslySetInnerHTML"
> & {
  /** Programming language for syntax highlighting (optional) */
  language?: CodeLanguage;
  /** Pre-highlighted HTML for SSR */
  html?: string;
};
