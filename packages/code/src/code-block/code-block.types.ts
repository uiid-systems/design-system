import type { BundledLanguage } from "../highlighter/highlighter.types";

export type CodeBlockProps = React.ComponentProps<"div"> & {
  /** The code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: BundledLanguage;
  /** Filename to display in header */
  filename?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Show copy button */
  copyable?: boolean;
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[];
  /** Pre-highlighted HTML for SSR */
  html?: string;
  /** Props for the header element */
  HeaderProps?: React.ComponentProps<"div">;
  /** Props for the copy button */
  CopyButtonProps?: React.ComponentProps<"button">;
};

export type CodeBlockHeaderProps = React.ComponentProps<"div"> & {
  /** Filename to display */
  filename?: string;
  /** Show copy button */
  copyable?: boolean;
  /** Code to copy */
  code?: string;
  /** Props for the copy button */
  CopyButtonProps?: React.ComponentProps<"button">;
};

export type CodeBlockCopyButtonProps = React.ComponentProps<"button"> & {
  /** Code to copy to clipboard */
  code: string;
};

export type CodeBlockContentProps = React.ComponentProps<"div"> & {
  /** HTML content to render */
  html: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[];
};
