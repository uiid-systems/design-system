import type { GroupProps, StackProps } from "@uiid/layout";
import type { ButtonProps } from "@uiid/buttons";

import type { BundledLanguage } from "../highlighter/highlighter.types";

export type CodeBlockCopyButtonProps = ButtonProps & {
  /** Code to copy to clipboard */
  code: string;
};

export type CodeBlockHeaderProps = GroupProps & {
  /** Filename to display */
  filename?: string;
  /** Show copy button */
  copyable?: boolean;
  /** Code to copy */
  code?: string;
  /** Props for the copy button */
  CopyButtonProps?: CodeBlockCopyButtonProps;
};

export type CodeBlockContentProps = StackProps & {
  /** HTML content to render */
  html: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[];
};

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
  HeaderProps?: CodeBlockHeaderProps;
  /** Props for the copy button */
  CopyButtonProps?: CodeBlockCopyButtonProps;
};
