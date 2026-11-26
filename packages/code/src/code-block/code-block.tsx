"use client";

import {
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogViewport,
} from "@uiid/overlays";
import { cx, definedProps, useComposedRefs } from "@uiid/utils";
import * as React from "react";

import {
  DEFAULT_COPYABLE,
  DEFAULT_FULLSCREENABLE,
  DEFAULT_LANGUAGE,
  DEFAULT_WRAP,
  DEFAULT_WRAPPABLE,
} from "../code.constants";
import { useHighlight } from "../highlighter/highlighter.hooks";
import { HighlightedCodeContext } from "./code-block.context";
import type { CodeBlockProps } from "./code-block.types";
import {
  CodeBlockHeader,
  CodeBlockContent,
  CodeBlockExpandToggle,
} from "./subcomponents";

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
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  expandLabel = "Show more",
  collapseLabel = "Show less",
  wrap: wrapProp,
  defaultWrap = DEFAULT_WRAP,
  onWrapChange,
  fullscreen: fullscreenProp,
  onFullscreenChange,
  finalFocus,
  onCopy,
  html: prerenderedHtml,
  className,
  HeaderProps,
  LanguageIconProps,
  WrapButtonProps,
  CopyButtonProps,
  FullscreenButtonProps,
  ContentProps,
  ExpandToggleProps,
  ...props
}: CodeBlockProps) => {
  const language = languageProp ?? DEFAULT_LANGUAGE;

  // Each state is controlled once its prop is set: the prop is the value, and
  // the local copy is only kept for the uncontrolled case.
  const [wrapState, setWrapState] = React.useState(defaultWrap);
  const wrapControlled = wrapProp !== undefined;
  const wrap = wrapControlled ? wrapProp : wrapState;
  const handleWrapChange = React.useCallback(
    (next: boolean) => {
      if (!wrapControlled) setWrapState(next);
      onWrapChange?.(next);
    },
    [wrapControlled, onWrapChange],
  );

  const [fullscreenState, setFullscreenState] = React.useState(false);
  const fullscreenControlled = fullscreenProp !== undefined;
  const fullscreen = fullscreenControlled ? fullscreenProp : fullscreenState;
  // Base UI passes event details after the next state; only the state is ours.
  const handleFullscreenChange = React.useCallback(
    (next: boolean) => {
      if (!fullscreenControlled) setFullscreenState(next);
      onFullscreenChange?.(next);
    },
    [fullscreenControlled, onFullscreenChange],
  );

  // A trailing newline ends the last line rather than starting a blank one, so
  // the code shown leaves it out. The copy button still copies `code` as given.
  const shownCode = code.replace(TRAILING_NEWLINE, "");
  const {
    html,
    code: highlightedCode,
    error,
  } = useHighlight(shownCode, language, {
    highlightLines,
    enabled: !prerenderedHtml,
  });
  const serverHtml = React.useMemo(
    () => prerenderedHtml && withoutTrailingLine(prerenderedHtml, code),
    [prerenderedHtml, code],
  );
  // After a failed highlight the last result is for older code, so the plain
  // current code shows instead until a highlight succeeds.
  const displayHtml = serverHtml || (!error && html) || undefined;
  // Prerendered html is taken as covering all of `code`.
  const displayHtmlCode = serverHtml ? undefined : highlightedCode;

  const [expandedState, setExpandedState] = React.useState(defaultExpanded);
  const expandedControlled = expandedProp !== undefined;
  const expanded = expandedControlled ? expandedProp : expandedState;
  const handleExpandedChange = React.useCallback(
    (next: boolean) => {
      if (!expandedControlled) setExpandedState(next);
      onExpandedChange?.(next);
    },
    [expandedControlled, onExpandedChange],
  );

  // Closing returns focus to whatever had it when the view opened. When that
  // was nothing, the body, or an element since removed (an open on mount, or a
  // click in Safari, which does not focus the clicked button), the inline
  // toggle takes it instead. Base UI treats a function as an explicit return,
  // so focus moves on close even if the caller moved it outside the view first.
  const fullscreenButtonRef = React.useRef<HTMLButtonElement>(null);
  const inlineFullscreenButtonRef = useComposedRefs(
    FullscreenButtonProps?.ref,
    fullscreenButtonRef,
  );
  const focusedAtOpenRef = React.useRef<Element | null>(null);
  React.useLayoutEffect(() => {
    if (!fullscreen) return;
    const doc = fullscreenButtonRef.current?.ownerDocument ?? document;
    focusedAtOpenRef.current = doc.activeElement;
  }, [fullscreen]);
  const returnFocus = React.useCallback(() => {
    const focused = focusedAtOpenRef.current;
    if (focused?.isConnected && focused !== focused.ownerDocument.body) {
      return true;
    }
    return fullscreenButtonRef.current ?? true;
  }, []);

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
          {...slot(HeaderProps)}
          {...definedProps({ filename, language: languageProp })}
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
          CopyButtonProps={{ ...slot(CopyButtonProps), onCopy }}
          FullscreenButtonProps={
            inFullscreen
              ? slot(FullscreenButtonProps)
              : { ...FullscreenButtonProps, ref: inlineFullscreenButtonRef }
          }
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
          {/* Line numbers are CodeBlock's with its own default, so an unset one
              is not routed through definedProps() as filename is above. */}
          <HighlightedCodeContext value={displayHtmlCode}>
            <CodeBlockContent
              aria-label={filename}
              {...withoutContent(slot(ContentProps))}
              html={displayHtml}
              code={shownCode}
              showLineNumbers={showLineNumbers}
              wrap={wrap}
            />
          </HighlightedCodeContext>
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
          <CodeBlockExpandToggle
            {...ExpandToggleProps}
            expanded={expanded}
            onExpandedChange={handleExpandedChange}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
          />
        )}
      </div>

      {fullscreenable && (
        <DialogRoot open={fullscreen} onOpenChange={handleFullscreenChange}>
          <DialogPortal data-slot="code-block-fullscreen">
            {/* forceRender keeps the scrim when nested in another Dialog. */}
            <DialogBackdrop forceRender data-slot="code-block-backdrop" />
            <DialogViewport>
              {/* Unstyled, so the popup is the block's own frame. */}
              <DialogPopup
                unstyled
                size="full"
                ref={popupRef}
                data-slot="code-block"
                data-wrap={wrap || undefined}
                data-fullscreen
                aria-label={filename ?? "Code block"}
                className={cx(styles["code-block"], className)}
                initialFocus={popupRef}
                finalFocus={finalFocus ?? returnFocus}
              >
                {renderParts(true)}
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>
      )}
    </>
  );
};
CodeBlock.displayName = "CodeBlock";

type WithContent = { children?: unknown; dangerouslySetInnerHTML?: unknown };

/**
 * CodeBlock renders the code as the content. The part spreads its props after
 * its own markup, so these are removed from the slot rather than set to
 * `undefined`, which would erase the highlighted code.
 */
const withoutContent = <T,>(slotProps: T): T => {
  if (!slotProps) return slotProps;
  const {
    children: _children,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = slotProps as T & WithContent;
  return rest as T;
};

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

const TRAILING_NEWLINE = /\r?\n$/;

/** Shiki's empty last line, which a trailing newline in its input renders. */
const EMPTY_LAST_LINE = /\n<span class="line"><\/span>(<\/code><\/pre>\s*)$/;

/**
 * Server `html` is highlighted from `code` as given, so a trailing newline in
 * it leaves an empty last line in the markup. Drop that line, as the code shown
 * on the client drops the newline.
 */
const withoutTrailingLine = (html: string, code: string) =>
  TRAILING_NEWLINE.test(code) ? html.replace(EMPTY_LAST_LINE, "$1") : html;
