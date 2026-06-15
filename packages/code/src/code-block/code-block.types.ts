import type { GroupProps, StackProps } from "@uiid/layout";
import type { ButtonProps, ToggleButtonProps } from "@uiid/buttons";

import type { BundledLanguage } from "../highlighter/highlighter.types";
import type { LanguageIconProps } from "./language-icons";

export type CodeBlockCopyButtonProps = Omit<ButtonProps, "onCopy"> & {
  /** Code to copy to clipboard */
  code?: string;
  /** Fires after the code is successfully copied */
  onCopy?: (code: string) => void;
};

export type CodeBlockWrapButtonProps = Omit<ToggleButtonProps, "icon" | "text">;

export type CodeBlockHeaderProps = GroupProps & {
  /** Filename to display */
  filename?: string;
  /** Language icon to display before the filename */
  language?: BundledLanguage;
  /** Show copy button */
  copyable?: boolean;
  /** Code to copy */
  code?: string;
  /** Render a wrap toggle in the header */
  wrappable?: boolean;
  /** Current wrap state (controlled) */
  wrap?: boolean;
  /** Initial wrap state (uncontrolled) */
  defaultWrap?: boolean;
  /** Fires when the wrap toggle is pressed */
  onWrapChange?: (wrap: boolean) => void;
  /** Props for the language icon */
  LanguageIconProps?: Omit<LanguageIconProps, "language">;
  /** Props for the wrap button */
  WrapButtonProps?: CodeBlockWrapButtonProps;
  /** Props for the copy button */
  CopyButtonProps?: CodeBlockCopyButtonProps;
};

export type CodeBlockContentProps = StackProps & {
  /** HTML content to render */
  html: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Soft-wrap long lines instead of horizontal scroll */
  wrap?: boolean;
};

export type CodeBlockProps = Omit<React.ComponentProps<"div">, "onCopy"> & {
  /** The code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: BundledLanguage;
  /** Filename to display in header */
  filename?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[];
  /** Maximum visible rows before content collapses behind a "Show more" toggle */
  rows?: number;
  /** Initial expanded state when `rows` is set */
  defaultExpanded?: boolean;
  /** Initial wrap state */
  defaultWrap?: boolean;
  /** Fires when the wrap toggle is pressed */
  onWrapChange?: (wrap: boolean) => void;
  /** Fires after the code is successfully copied */
  onCopy?: (code: string) => void;
  /** Pre-highlighted HTML for SSR */
  html?: string;
  /** Props for the header element */
  HeaderProps?: CodeBlockHeaderProps;
  /** Props for the language icon */
  LanguageIconProps?: Omit<LanguageIconProps, "language">;
  /** Props for the wrap button */
  WrapButtonProps?: CodeBlockWrapButtonProps;
  /** Props for the copy button */
  CopyButtonProps?: CodeBlockCopyButtonProps;
};
