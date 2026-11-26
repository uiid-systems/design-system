"use client";

import * as React from "react";

import { CodeBlockContent, CodeBlockCopyButton } from "../code-block";
import { DEFAULT_COPYABLE } from "../code.constants";
import { useHighlight } from "../highlighter/highlighter.hooks";
import { RESET_RESERVE } from "./code-preview.constants";
import type { CodePreviewProps } from "./code-preview.types";
import {
  CodePreviewBar,
  CodePreviewCanvas,
  CodePreviewPanel,
  CodePreviewResetButton,
  CodePreviewRoot,
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
  const cornerRef = React.useRef<HTMLDivElement>(null);
  const handleReset = () => {
    // Focus held by the example, or by a popover or dialog it opened, would
    // drop to the body as the example remounts. A click leaves it there when
    // it does not focus the button (Safari), so move it to the button first.
    const button = cornerRef.current?.querySelector("button");
    if (button && document.activeElement !== button) button.focus();
    setResetKey((key) => key + 1);
    onReset?.();
  };

  // The button covers the canvas's top-right corner, so at the default
  // padding the canvas makes room for it above the example, and as much below
  // so the example stays centred. A caller's padding replaces this.
  const { p, py, pt, pb } = CanvasProps ?? {};
  const padded =
    p !== undefined || py !== undefined || pt !== undefined || pb !== undefined;
  const reserve = resettable && !padded ? RESET_RESERVE : undefined;

  const hasCode = !!code;
  const { html } = useHighlight(code ?? "", language, {
    highlightLines,
    enabled: shown && hasCode && !prerenderedHtml,
  });

  return (
    <CodePreviewRoot
      className={className}
      {...props}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <CodePreviewCanvas py={reserve} {...CanvasProps}>
        <CodePreviewBoundary key={resetKey}>{children}</CodePreviewBoundary>
      </CodePreviewCanvas>
      {resettable && (
        // Places the button in the frame's top-right corner, which is the
        // canvas's, outside the canvas so it stays put while a wide example
        // scrolls. The button stays in this box's flow, so its tooltip
        // anchors to the button.
        <div
          ref={cornerRef}
          data-slot="code-preview-reset"
          className={styles["code-preview-reset"]}
        >
          <CodePreviewResetButton {...ResetButtonProps} onClick={handleReset} />
        </div>
      )}

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
    </CodePreviewRoot>
  );
};
CodePreview.displayName = "CodePreview";
