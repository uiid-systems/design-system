import type { StackProps } from "@uiid/layout";

import type {
  CodeBlockHeaderProps,
  CodeBlockCopyButtonProps,
} from "../code-block/code-block.types";
import type { CodeLanguage } from "../highlighter/highlighter.types";

export type CodeEditorTextareaProps = Omit<
  React.ComponentProps<"textarea">,
  "value" | "defaultValue" | "readOnly" | "disabled" | "placeholder" | "rows"
>;

export type CodeEditorProps = Omit<StackProps, "defaultValue" | "onChange"> & {
  /** The code content (controlled) */
  value?: string;
  /** Initial code content (uncontrolled) */
  defaultValue?: string;
  /** Callback when code changes */
  onValueChange?: (value: string) => void;
  /** Programming language for syntax highlighting */
  language?: CodeLanguage;

  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Make the editor read-only */
  readOnly?: boolean;
  /** Disable the editor */
  disabled?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Maximum visible rows (sets max-height) */
  rows?: number;

  /** Filename to display in header */
  filename?: string;
  /** Show copy button in header */
  copyable?: boolean;

  /**
   * Reaches the header element. `filename`, `copyable`, the copied code and
   * `CopyButtonProps` are set on CodeEditor itself. `language` here shows a
   * language icon in the header, apart from the top-level `language`. The
   * editor has no wrap or fullscreen button, so those keys are left out too.
   */
  HeaderProps?: Omit<
    CodeBlockHeaderProps,
    | "filename"
    | "copyable"
    | "code"
    | "CopyButtonProps"
    | "wrappable"
    | "wrap"
    | "defaultWrap"
    | "onWrapChange"
    | "WrapButtonProps"
    | "fullscreenable"
    | "fullscreen"
    | "onFullscreenChange"
    | "FullscreenButtonProps"
  >;
  /** Props for the copy button */
  CopyButtonProps?: Omit<CodeBlockCopyButtonProps, "code">;
  /** Props for the textarea, including `ref`, `name`, `id` and `aria-*` */
  TextareaProps?: CodeEditorTextareaProps;
};
