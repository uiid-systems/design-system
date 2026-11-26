"use client";

import { CollapsibleRoot } from "@uiid/interactive";
import { cx } from "@uiid/utils";
import * as React from "react";

import { CodeBlockContent, CodeBlockCopyButton } from "../code-block";
import { DEFAULT_COPYABLE } from "../code.constants";
import { useHighlight } from "../highlighter/highlighter.hooks";
import type { CodePreviewProps } from "./code-preview.types";
import {
  CodePreviewBar,
  CodePreviewCanvas,
  CodePreviewPanel,
  CodePreviewResetButton,
  CodePreviewTrigger,
} from "./subcomponents";
import { CodePreviewBoundary } from "./subcomponents/code-preview-boundary";

import styles from "./code-preview.module.css";

type OpenChange = NonNullable<CodePreviewProps["onOpenChange"]>;

export const CodePreview = ({
  children,
  code,
  html: prerenderedHtml,
  language,
  showLineNumbers,
  highlightLines,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  copyable = DEFAULT_COPYABLE,
  onCopy,
  resettable = false,
  onReset,
  showLabel,
  hideLabel,
  className,
  CanvasProps,
  BarProps,
  TriggerProps,
  PanelProps,
  ResetButtonProps,
  CopyButtonProps,
  ContentProps,
  ...props
}: CodePreviewProps) => {
  // Controlled once `open` is set; the local copy is for the uncontrolled case.
  const [openState, setOpenState] = React.useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;
  const handleOpenChange = React.useCallback<OpenChange>(
    (next, details) => {
      if (!controlled) setOpenState(next);
      onOpenChange?.(next, details);
    },
    [controlled, onOpenChange],
  );

  // Latches the first time the code is shown, so the highlighter loads then
  // and never while the code stays hidden. Set during render, so the first
  // open already asks for the highlight.
  const [shown, setShown] = React.useState(open);
  if (open && !shown) setShown(true);

  // Bumped by reset. It keys the boundary around `children`, so the example
  // remounts from the nodes it was given, which is all a server component
  // hands over, and a caught error clears with it. The reset button sits
  // outside the keyed subtree, so it keeps focus across the remount.
  const [resetKey, setResetKey] = React.useState(0);
  const handleReset = () => {
    setResetKey((key) => key + 1);
    onReset?.();
  };

  const hasCode = !!code;
  const { html } = useHighlight(code ?? "", language, {
    highlightLines,
    enabled: shown && hasCode && !prerenderedHtml,
  });

  return (
    <CollapsibleRoot
      data-slot="code-preview"
      className={cx(styles["code-preview"], className)}
      {...props}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <CodePreviewCanvas {...CanvasProps}>
        <CodePreviewBoundary key={resetKey}>{children}</CodePreviewBoundary>
        {resettable && (
          <CodePreviewResetButton {...ResetButtonProps} onClick={handleReset} />
        )}
      </CodePreviewCanvas>

      {hasCode && (
        <>
          <CodePreviewBar {...BarProps}>
            <CodePreviewTrigger
              {...TriggerProps}
              showLabel={showLabel}
              hideLabel={hideLabel}
            />
            {copyable && (
              <CodeBlockCopyButton
                {...CopyButtonProps}
                code={code}
                onCopy={onCopy}
              />
            )}
          </CodePreviewBar>

          <CodePreviewPanel {...PanelProps}>
            <CodeBlockContent
              {...ContentProps}
              html={prerenderedHtml || html || undefined}
              code={code}
              showLineNumbers={showLineNumbers}
            />
          </CodePreviewPanel>
        </>
      )}
    </CollapsibleRoot>
  );
};
CodePreview.displayName = "CodePreview";
