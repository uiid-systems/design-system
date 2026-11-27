import type { ButtonProps } from "@uiid/buttons";
import type {
  CollapsiblePanelProps,
  CollapsibleRootProps,
  CollapsibleTriggerProps,
} from "@uiid/interactive";
import type { StackProps } from "@uiid/layout";
import type { WithStringClassName } from "@uiid/utils";

import type {
  CodeBlockContentProps,
  CodeBlockCopyButtonProps,
} from "../code-block/code-block.types";
import type { CodeLanguage } from "../highlighter/highlighter.types";

/**
 * The frame around the canvas, the code and the footer: a `CollapsibleRoot`
 * that opens and closes the panel.
 */
export type CodePreviewRootProps = WithStringClassName<CollapsibleRootProps>;

/** The area that holds the live example. */
export type CodePreviewCanvasProps = StackProps;

export type CodePreviewTriggerProps = WithStringClassName<
  Omit<CollapsibleTriggerProps, "children" | "render">
> & {
  /**
   * The trigger's text while the code is hidden
   * @default "Show code"
   */
  showLabel?: React.ReactNode;
  /**
   * The trigger's text while the code is shown
   * @default "Hide code"
   */
  hideLabel?: React.ReactNode;
};

/** The icon button that remounts the example. Named "Reset preview". */
export type CodePreviewResetButtonProps = Omit<ButtonProps, "children">;

/** The area that holds the code. */
export type CodePreviewPanelProps = Omit<CollapsiblePanelProps, "orientation">;

export type CodePreviewProps = Omit<
  React.ComponentProps<"div">,
  "onCopy" | "children"
> &
  Pick<CollapsibleRootProps, "open" | "defaultOpen" | "onOpenChange"> & {
    /** The live example */
    children?: React.ReactNode;
    /** The example's source. Without it, only the canvas renders. */
    code?: string;
    /**
     * Pre-highlighted HTML for `code`. Without it, the code highlights on the
     * client the first time it is shown, and never while it stays hidden.
     */
    html?: string;
    /**
     * Programming language for syntax highlighting, as on CodeBlock
     * @default "typescript"
     */
    language?: CodeLanguage;
    /** Show line numbers */
    showLineNumbers?: boolean;
    /** Lines to highlight (1-indexed) */
    highlightLines?: number[];
    /**
     * Render the copy button, floating in the code's top-right corner, so it
     * is reachable while the code is open. It is left out while `code` is
     * empty.
     * @default true
     */
    copyable?: boolean;
    /** Fires after the code is successfully copied */
    onCopy?: (code: string) => void;
    /**
     * Render a reset button in the canvas that remounts `children`, so load
     * animations replay and state inside the example returns to its start.
     * @default false
     */
    resettable?: boolean;
    /** Fires on each press of the reset button, before the example remounts */
    onReset?: () => void;
    /**
     * The trigger's text while the code is hidden
     * @default "Show code"
     */
    showLabel?: React.ReactNode;
    /**
     * The trigger's text while the code is shown
     * @default "Hide code"
     */
    hideLabel?: React.ReactNode;
    /** Reaches the canvas. Its content is `children`. */
    CanvasProps?: Omit<CodePreviewCanvasProps, "children">;
    /**
     * Reaches the footer toggle that opens and closes the code. Its labels
     * are set on CodePreview itself.
     */
    TriggerProps?: Omit<CodePreviewTriggerProps, "showLabel" | "hideLabel">;
    /** Reaches the reset button. Pressing it resets; listen with `onReset`. */
    ResetButtonProps?: Omit<CodePreviewResetButtonProps, "onClick">;
    /** Reaches the panel. Its content is the code. */
    PanelProps?: Omit<CodePreviewPanelProps, "children">;
    /**
     * Reaches the copy button, which floats in the code's top-right corner.
     * `code` and `onCopy` are set on CodePreview itself.
     */
    CopyButtonProps?: Omit<CodeBlockCopyButtonProps, "code" | "onCopy">;
    /**
     * Reaches the highlighted code. The code, its highlighting and line
     * numbers are set on CodePreview itself.
     */
    ContentProps?: Omit<
      CodeBlockContentProps,
      | "html"
      | "code"
      | "showLineNumbers"
      | "children"
      | "dangerouslySetInnerHTML"
    >;
  };
