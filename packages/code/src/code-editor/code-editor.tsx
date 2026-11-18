"use client";

import { Stack, Layer } from "@uiid/layout";
import { cx, useComposedRefs } from "@uiid/utils";
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
  const { html, loading } = useHighlight(value || " ", language);

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

  // Show header if filename or copyable
  const showHeader = filename || copyable;

  return (
    <Stack
      data-slot="code-editor"
      data-disabled={disabled || undefined}
      className={cx(styles["code-editor"], className)}
      fullwidth
      {...props}
    >
      {showHeader && (
        <CodeBlockHeader
          filename={filename}
          copyable={copyable}
          code={value}
          CopyButtonProps={CopyButtonProps}
          {...HeaderProps}
        />
      )}

      {/* Typography on parent so both children inherit */}
      <Layer
        className={cx(styles["code-editor-layer"], codeTypographyVariant())}
        style={
          rows
            ? {
                maxHeight: `calc(${rows} * var(--code-font-size) * var(--code-line-height) + 2 * var(--code-padding))`,
                overflow: "auto",
              }
            : undefined
        }
        fullwidth
      >
        {/* Highlighted code backdrop */}
        <div
          ref={highlightRef}
          data-slot="code-editor-highlight"
          className={cx(
            styles["code-editor-highlight"],
            shikiVariants({ showLineNumbers }),
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

      {loading && !value && <div>Loading...</div>}
    </Stack>
  );
};
CodeEditor.displayName = "CodeEditor";
