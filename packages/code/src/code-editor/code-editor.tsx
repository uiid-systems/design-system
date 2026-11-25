"use client";

import { Stack, Layer } from "@uiid/layout";
import { cx, definedProps, useComposedRefs } from "@uiid/utils";
import { useState, useCallback, useRef } from "react";

import { CodeBlockHeader } from "../code-block/subcomponents";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_SHOW_LINE_NUMBERS,
  DEFAULT_COPYABLE,
  DEFAULT_CODE,
} from "../code.constants";
import { codeTypographyVariant, shikiVariants } from "../code.variants";
import { useHighlight } from "../highlighter/highlighter.hooks";
import type { CodeEditorProps } from "./code-editor.types";

import styles from "./code-editor.module.css";

export const CodeEditor = ({
  value: valueProp,
  defaultValue = DEFAULT_CODE,
  onValueChange,
  language = DEFAULT_LANGUAGE,
  showLineNumbers = DEFAULT_SHOW_LINE_NUMBERS,
  readOnly,
  disabled,
  placeholder,
  rows,
  filename,
  copyable = DEFAULT_COPYABLE,
  HeaderProps,
  CopyButtonProps,
  TextareaProps,
  className,
  ...props
}: CodeEditorProps) => {
  // Controlled/uncontrolled state
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // The props the editor also sets are pulled out of the slot, so they are
  // composed or chained below rather than replaced by the caller's.
  const {
    ref: textareaRefProp,
    className: textareaClassName,
    onChange: onTextareaChange,
    onScroll: onTextareaScroll,
    ...textareaProps
  } = TextareaProps ?? {};
  const composedTextareaRef = useComposedRefs(textareaRefProp, textareaRef);

  // `aria-labelledby` outranks `aria-label`, so no default is emitted beside it
  const defaultLabel = textareaProps["aria-labelledby"]
    ? undefined
    : filename
      ? `${filename} code editor`
      : "Code editor";

  // Syntax highlighting
  const { html } = useHighlight(value || " ", language);

  // Sync scroll between textarea and highlight layer
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (textareaRef.current && highlightRef.current) {
        highlightRef.current.scrollTop = textareaRef.current.scrollTop;
        highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
      onTextareaScroll?.(e);
    },
    [onTextareaScroll],
  );

  // Handle text changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Intentional: a read-only editor skips `TextareaProps.onChange` too
      if (readOnly) return;
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
      onTextareaChange?.(e);
    },
    [readOnly, isControlled, onValueChange, onTextareaChange],
  );

  return (
    <Stack
      data-slot="code-editor"
      data-disabled={disabled || undefined}
      className={cx(styles["code-editor"], className)}
      w="full"
      {...props}
    >
      {/* The header renders from its content, so an empty editor without a filename has none */}
      <CodeBlockHeader
        {...HeaderProps}
        {...definedProps({ filename })}
        copyable={copyable}
        code={value}
        CopyButtonProps={CopyButtonProps}
      />

      {/* Typography on parent so both children inherit */}
      <Layer
        data-line-numbers={showLineNumbers || undefined}
        className={cx(styles["code-editor-layer"], codeTypographyVariant())}
        data-rows={rows ? true : undefined}
        // The row count is the only value the editor writes inline; the CSS module turns
        // it into the max height.
        style={
          rows ? ({ "--code-rows": rows } as React.CSSProperties) : undefined
        }
        w="full"
      >
        {/* Highlighted code backdrop: a duplicate of the textarea's text, so `inert` keeps Shiki's focusable `<pre>` out of the tab order and the accessibility tree */}
        <div
          ref={highlightRef}
          inert
          data-slot="code-editor-highlight"
          className={cx(
            styles["code-editor-highlight"],
            // The editor draws its own line numbers in its gutter (see the CSS module)
            shikiVariants({ showLineNumbers: false }),
          )}
          dangerouslySetInnerHTML={{ __html: html || "" }}
        />

        {/* Transparent textarea overlay: defaults, then the caller's props, then the props the editor owns */}
        <textarea
          aria-label={defaultLabel}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          data-gramm="false"
          {...textareaProps}
          ref={composedTextareaRef}
          data-slot="code-editor-textarea"
          data-readonly={readOnly || undefined}
          className={cx(styles["code-editor-textarea"], textareaClassName)}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
        />
      </Layer>
    </Stack>
  );
};
CodeEditor.displayName = "CodeEditor";
