"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cx, cxState } from "@uiid/utils";
import * as React from "react";

import {
  DEFAULT_COPYABLE,
  DEFAULT_FULLSCREENABLE,
  DEFAULT_LANGUAGE,
  DEFAULT_WRAP,
  DEFAULT_WRAPPABLE,
} from "../code.constants";
import { useHighlight } from "../highlighter/highlighter.hooks";
import type { CodeBlockProps } from "./code-block.types";
import { CodeBlockHeader, CodeBlockContent } from "./subcomponents";

import styles from "./code-block.module.css";

export const CodeBlock = ({
  code,
  language: languageProp,
  filename,
  showLineNumbers,
  highlightLines,
  copyable = DEFAULT_COPYABLE,
  wrappable = DEFAULT_WRAPPABLE,
  fullscreenable = DEFAULT_FULLSCREENABLE,
  rows,
  defaultExpanded = false,
  expandLabel = "Show more",
  collapseLabel = "Show less",
  defaultWrap = DEFAULT_WRAP,
  onWrapChange,
  onFullscreenChange,
  onCopy,
  html: prerenderedHtml,
  className,
  HeaderProps,
  LanguageIconProps,
  WrapButtonProps,
  CopyButtonProps,
  FullscreenButtonProps,
  ...props
}: CodeBlockProps) => {
  const language = languageProp ?? DEFAULT_LANGUAGE;

  const [wrap, setWrap] = React.useState(defaultWrap);
  const handleWrapChange = React.useCallback(
    (next: boolean) => {
      setWrap(next);
      onWrapChange?.(next);
    },
    [onWrapChange],
  );

  const [fullscreen, setFullscreen] = React.useState(false);
  const handleFullscreenChange = React.useCallback(
    (next: boolean) => {
      setFullscreen(next);
      onFullscreenChange?.(next);
    },
    [onFullscreenChange],
  );

  const { html, error } = useHighlight(code, language, {
    highlightLines,
    enabled: !prerenderedHtml,
  });
  const displayHtml = prerenderedHtml || html || undefined;

  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [overflows, setOverflows] = React.useState(false);
  const contentWrapperRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  // Truthy, as in CodeEditor, so `rows={0}` means no cap.
  const hasRows = !!rows;
  const isCollapsed = hasRows && !expanded;
  // The row count is the only value written inline; the CSS module turns it
  // into the collapsed height while `data-collapsed` is set.
  const scrollStyle = hasRows
    ? ({ "--code-rows": rows } as React.CSSProperties)
    : undefined;

  // A layout effect decides the toggle before paint. Measure against the
  // collapsed height even while expanded, so a block whose code fits in its
  // rows never offers a toggle that does nothing.
  React.useLayoutEffect(() => {
    const el = contentWrapperRef.current;
    if (!hasRows || !el || !displayHtml) {
      return;
    }
    const measure = () => {
      const collapsed = el.hasAttribute("data-collapsed");
      el.setAttribute("data-collapsed", "");
      setOverflows(el.scrollHeight > el.clientHeight + 1);
      if (!collapsed) el.removeAttribute("data-collapsed");
    };
    measure();

    // Re-measure when the block or its code resizes: a container resize, a
    // wrap reflow, or a block that was hidden when first measured.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [displayHtml, hasRows, rows, wrap]);

  const showToggle = hasRows && overflows;

  // The header, code and error are shared by the inline block and the
  // fullscreen dialog. The inline block stays mounted while the dialog is open,
  // so its toggle can take focus back and its copy state survives.
  const renderParts = (inFullscreen: boolean) => {
    const slot = inFullscreen
      ? withoutIdentity
      : <T,>(slotProps: T) => slotProps;
    return (
      <>
        <CodeBlockHeader
          filename={filename}
          language={languageProp}
          copyable={copyable}
          code={code}
          wrappable={wrappable}
          wrap={wrap}
          onWrapChange={handleWrapChange}
          fullscreenable={fullscreenable}
          fullscreen={fullscreen}
          onFullscreenChange={handleFullscreenChange}
          LanguageIconProps={slot(LanguageIconProps)}
          WrapButtonProps={slot(WrapButtonProps)}
          CopyButtonProps={{ onCopy, ...slot(CopyButtonProps) }}
          FullscreenButtonProps={slot(FullscreenButtonProps)}
          {...slot(HeaderProps)}
        />

        <div
          ref={inFullscreen ? undefined : contentWrapperRef}
          data-slot="code-block-scroll"
          data-rows={hasRows || undefined}
          // Only the inline copy collapses; fullscreen shows every row.
          data-collapsed={(!inFullscreen && isCollapsed) || undefined}
          className={styles["code-block-scroll"]}
          style={scrollStyle}
        >
          <CodeBlockContent
            html={displayHtml}
            code={code}
            showLineNumbers={showLineNumbers}
            wrap={wrap}
          />
        </div>

        {error && !prerenderedHtml && (
          <div
            data-slot="code-block-error"
            className={styles["code-block-error"]}
          >
            [Error: {error.message}]
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div
        data-slot="code-block"
        data-expanded={hasRows ? expanded || undefined : undefined}
        data-wrap={wrap || undefined}
        className={cx(styles["code-block"], className)}
        {...props}
      >
        {renderParts(false)}

        {showToggle && (
          <button
            type="button"
            data-slot="code-block-expand-toggle"
            className={styles["code-block-expand-toggle"]}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? collapseLabel : expandLabel}
          </button>
        )}
      </div>

      {fullscreenable && (
        <BaseDialog.Root
          open={fullscreen}
          onOpenChange={handleFullscreenChange}
        >
          <BaseDialog.Portal data-slot="code-block-fullscreen">
            {/* forceRender keeps the scrim when nested in another Dialog. */}
            <BaseDialog.Backdrop
              forceRender
              data-slot="code-block-backdrop"
              className={styles["code-block-backdrop"]}
            />
            <BaseDialog.Popup
              ref={popupRef}
              data-slot="code-block"
              data-wrap={wrap || undefined}
              data-fullscreen
              aria-label={filename ?? "Code block"}
              className={cxState(styles["code-block"], className)}
              initialFocus={popupRef}
            >
              {renderParts(true)}
            </BaseDialog.Popup>
          </BaseDialog.Portal>
        </BaseDialog.Root>
      )}
    </>
  );
};
CodeBlock.displayName = "CodeBlock";

type WithIdentity = { id?: unknown; ref?: unknown };

/**
 * The fullscreen copy renders the same slot props as the inline block. Leave
 * out `id` and `ref` so neither is duplicated or repointed at the copy.
 */
const withoutIdentity = <T,>(slotProps: T): T => {
  if (!slotProps) return slotProps;
  const { id: _id, ref: _ref, ...rest } = slotProps as T & WithIdentity;
  return rest as T;
};
