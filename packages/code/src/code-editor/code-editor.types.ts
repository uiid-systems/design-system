import type { StackProps } from "@uiid/layout";

import type { BundledLanguage } from "../highlighter/highlighter.types";
import type {
  CodeBlockHeaderProps,
  CodeBlockCopyButtonProps,
} from "../code-block/code-block.types";

export type CodeEditorProps = Omit<StackProps, "defaultValue" | "onChange"> & {
  /** The code content (controlled) */
  value?: string;
  /** Initial code content (uncontrolled) */
  defaultValue?: string;
  /** Callback when code changes */
  onValueChange?: (value: string) => void;
  /** Programming language for syntax highlighting */
  language?: BundledLanguage;

  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Make the editor read-only */
  readOnly?: boolean;
  /** Disable the editor */
  disabled?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;

  /** Filename to display in header */
  filename?: string;
  /** Show copy button in header */
  copyable?: boolean;

  /** Props for the header element */
  HeaderProps?: CodeBlockHeaderProps;
  /** Props for the copy button */
  CopyButtonProps?: CodeBlockCopyButtonProps;
};
