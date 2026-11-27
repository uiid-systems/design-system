import type { ButtonProps, ToggleButtonProps } from "@uiid/buttons";
import type { GroupProps, StackProps } from "@uiid/layout";
import type { DialogPopupProps } from "@uiid/overlays";

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

export type CodeBlockExpandToggleProps = Omit<
  ButtonProps,
  "children" | "aria-expanded"
> & {
  /** Whether the block is expanded, which picks the label and `aria-expanded` */
  expanded?: boolean;
  /** Fires with the state the toggle asks for when it is pressed */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * The toggle's text while the block is collapsed. Pass text, or add an `aria-label`.
   * @default "Show more"
   */
  expandLabel?: React.ReactNode;
  /**
   * The toggle's text while the block is expanded. Pass text, or add an `aria-label`.
   * @default "Show less"
   */
  collapseLabel?: React.ReactNode;
};

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
  WrapButtonProps?: Omit<
    CodeBlockWrapButtonProps,
    "pressed" | "defaultPressed" | "onPressedChange"
  >;
  /** Props for the copy button */
  CopyButtonProps?: Omit<CodeBlockCopyButtonProps, "code">;
  /** Props for the fullscreen button */
  FullscreenButtonProps?: Omit<
    CodeBlockFullscreenButtonProps,
    "pressed" | "defaultPressed" | "onPressedChange"
  >;
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
  /**
   * Leave the language icon out of the header. `language` still picks the
   * grammar. With no filename either, there is no header bar and the buttons
   * float over the code, as they do for a language without an icon.
   */
  hideLanguageIcon?: boolean;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[];
  /**
   * Set to `false` to render notation comments such as `// [!code --]` as
   * written, instead of turning them into diff and highlight lines. Turn it off
   * for text you did not write, such as a model's reply, where such a comment
   * would show a line as removed that the copy button still copies. With
   * `html`, nothing is highlighted on the client and this has no effect: pass
   * `{ notations: false }` to `highlight()` instead.
   * @default true
   */
  notations?: boolean;
  /** Render the copy button in the header */
  copyable?: boolean;
  /** Render the line-wrap toggle in the header */
  wrappable?: boolean;
  /** Render the fullscreen toggle in the header */
  fullscreenable?: boolean;
  /** Maximum visible rows before content collapses behind a "Show more" toggle */
  rows?: number;
  /**
   * Whether the block is expanded past its `rows` (controlled). The toggle asks
   * for a change through `onExpandedChange`. Without `rows` nothing collapses,
   * so it has no effect.
   */
  expanded?: boolean;
  /** Initial expanded state when `rows` is set (uncontrolled) */
  defaultExpanded?: boolean;
  /** Fires with the next state when the "Show more" / "Show less" toggle is pressed */
  onExpandedChange?: (expanded: boolean) => void;
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
  /**
   * Whether long lines soft-wrap (controlled). The wrap toggle asks for a
   * change through `onWrapChange`.
   */
  wrap?: boolean;
  /** Initial wrap state (uncontrolled) */
  defaultWrap?: boolean;
  /** Fires with the next state when the wrap toggle is pressed */
  onWrapChange?: (wrap: boolean) => void;
  /**
   * Whether the fullscreen view is open (controlled). The fullscreen toggle,
   * Escape and the backdrop ask for a change through `onFullscreenChange`.
   * Needs `fullscreenable`: without it no fullscreen view is mounted.
   */
  fullscreen?: boolean;
  /** Fires with the next state when fullscreen is entered or left */
  onFullscreenChange?: (fullscreen: boolean) => void;
  /**
   * Where focus goes when the fullscreen view closes, as Base UI's Dialog
   * `finalFocus`. Unset, focus returns to whatever had it when the view opened,
   * or to the block's fullscreen toggle when that was nothing or the page body.
   * Set it to return focus to your own control, which Safari does not focus on
   * click.
   */
  finalFocus?: DialogPopupProps["finalFocus"];
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
  WrapButtonProps?: Omit<
    CodeBlockWrapButtonProps,
    "pressed" | "defaultPressed" | "onPressedChange"
  >;
  /** Props for the copy button. `code` and `onCopy` are set on CodeBlock itself. */
  CopyButtonProps?: Omit<CodeBlockCopyButtonProps, "code" | "onCopy">;
  /** Props for the fullscreen button */
  FullscreenButtonProps?: Omit<
    CodeBlockFullscreenButtonProps,
    "pressed" | "defaultPressed" | "onPressedChange"
  >;
  /**
   * Reaches the highlighted code, inline and fullscreen. The code, its
   * highlighting, line numbers and wrap are set on CodeBlock itself.
   */
  ContentProps?: Omit<
    CodeBlockContentProps,
    | "html"
    | "code"
    | "showLineNumbers"
    | "wrap"
    | "children"
    | "dangerouslySetInnerHTML"
  >;
  /**
   * Reaches the "Show more" / "Show less" toggle. Its state and labels are set
   * on CodeBlock itself.
   */
  ExpandToggleProps?: Omit<
    CodeBlockExpandToggleProps,
    "expanded" | "onExpandedChange" | "expandLabel" | "collapseLabel"
  >;
};
