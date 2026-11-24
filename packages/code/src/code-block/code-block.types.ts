import type { ButtonProps, ToggleButtonProps } from "@uiid/buttons";
import type { GroupProps, StackProps } from "@uiid/layout";

import type { CodeLanguage } from "../highlighter/highlighter.types";
import type { LanguageIconProps } from "./language-icons";

export type CodeBlockCopyButtonProps = Omit<ButtonProps, "onCopy"> & {
  /** Code to copy to clipboard */
  code?: string;
  /** Fires after the code is successfully copied */
  onCopy?: (code: string) => void;
};

export type CodeBlockWrapButtonProps = Omit<ToggleButtonProps, "icon" | "text">;

export type CodeBlockFullscreenButtonProps = Omit<
  ToggleButtonProps,
  "icon" | "text"
>;

export type CodeBlockHeaderProps = GroupProps & {
  /** Filename to display */
  filename?: string;
  /** Language icon to display before the filename */
  language?: CodeLanguage;
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
  /** Render a fullscreen toggle in the header */
  fullscreenable?: boolean;
  /** Current fullscreen state (controlled) */
  fullscreen?: boolean;
  /** Fires when the fullscreen toggle is pressed */
  onFullscreenChange?: (fullscreen: boolean) => void;
  /** Props for the language icon */
  LanguageIconProps?: Omit<LanguageIconProps, "language">;
  /** Props for the wrap button */
  WrapButtonProps?: CodeBlockWrapButtonProps;
  /** Props for the copy button */
  CopyButtonProps?: CodeBlockCopyButtonProps;
  /** Props for the fullscreen button */
  FullscreenButtonProps?: CodeBlockFullscreenButtonProps;
};

export type CodeBlockContentProps = StackProps & {
  /** Highlighted HTML content from shiki (preferred when available) */
  html?: string;
  /** Raw code, rendered as a fallback while highlighting is async-pending */
  code?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Soft-wrap long lines instead of horizontal scroll */
  wrap?: boolean;
};

export type CodeBlockProps = Omit<React.ComponentProps<"div">, "onCopy"> & {
  /** The code to display */
  code: string;
  /**
   * Programming language for syntax highlighting. Accepts a bundled language
   * or an alias (`ts`, `js`, `sh`, `shell`, `zsh`, `py`, `md`); any other name
   * renders as plain code.
   */
  language?: CodeLanguage;
  /** Filename to display in header */
  filename?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[];
  /** Render the copy button in the header */
  copyable?: boolean;
  /** Render the line-wrap toggle in the header */
  wrappable?: boolean;
  /** Render the fullscreen toggle in the header */
  fullscreenable?: boolean;
  /** Maximum visible rows before content collapses behind a "Show more" toggle */
  rows?: number;
  /** Initial expanded state when `rows` is set */
  defaultExpanded?: boolean;
  /**
   * The toggle's text while the block is collapsed
   * @default "Show more"
   */
  expandLabel?: React.ReactNode;
  /**
   * The toggle's text while the block is expanded
   * @default "Show less"
   */
  collapseLabel?: React.ReactNode;
  /** Initial wrap state */
  defaultWrap?: boolean;
  /** Fires when the wrap toggle is pressed */
  onWrapChange?: (wrap: boolean) => void;
  /** Fires when the fullscreen toggle is pressed */
  onFullscreenChange?: (fullscreen: boolean) => void;
  /** Fires after the code is successfully copied */
  onCopy?: (code: string) => void;
  /** Pre-highlighted HTML for SSR */
  html?: string;
  /**
   * Reaches the header element. What the header shows and the state of its
   * buttons are set on CodeBlock itself, as are the button slots.
   */
  HeaderProps?: Omit<
    CodeBlockHeaderProps,
    | "filename"
    | "language"
    | "copyable"
    | "code"
    | "wrappable"
    | "wrap"
    | "defaultWrap"
    | "onWrapChange"
    | "fullscreenable"
    | "fullscreen"
    | "onFullscreenChange"
    | "LanguageIconProps"
    | "WrapButtonProps"
    | "CopyButtonProps"
    | "FullscreenButtonProps"
  >;
  /** Props for the language icon */
  LanguageIconProps?: Omit<LanguageIconProps, "language">;
  /** Props for the wrap button */
  WrapButtonProps?: CodeBlockWrapButtonProps;
  /** Props for the copy button. Its `onCopy` runs before the top-level `onCopy`. */
  CopyButtonProps?: CodeBlockCopyButtonProps;
  /** Props for the fullscreen button */
  FullscreenButtonProps?: CodeBlockFullscreenButtonProps;
};
