"use client";

import { useState, useCallback, useRef } from "react";

import { Stack, Layer } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { useHighlight } from "../highlighter/highlighter.hooks";
import { CodeBlockHeader } from "../code-block/subcomponents";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_SHOW_LINE_NUMBERS,
  DEFAULT_COPYABLE,
  DEFAULT_CODE,
} from "../code.constants";
import { codeContentVariants } from "../code.variants";

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
  filename,
  copyable = DEFAULT_COPYABLE,
  HeaderProps,
  CopyButtonProps,
  className,
  ...props
}: CodeEditorProps) => {
  // Controlled/uncontrolled state
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Syntax highlighting
  const { html, loading } = useHighlight(value || " ", language);

  // Sync scroll between textarea and highlight layer
  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle text changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (readOnly) return;
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [readOnly, isControlled, onValueChange],
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

      <Layer className={styles["code-editor-layer"]} fullwidth>
        {/* Highlighted code backdrop */}
        <div
          ref={highlightRef}
          data-slot="code-editor-highlight"
          className={cx(
            styles["code-editor-highlight"],
            codeContentVariants({ showLineNumbers })
          )}
          dangerouslySetInnerHTML={{ __html: html || "" }}
        />

        {/* Transparent textarea overlay */}
        <textarea
          ref={textareaRef}
          data-slot="code-editor-textarea"
          data-readonly={readOnly || undefined}
          className={styles["code-editor-textarea"]}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          data-gramm="false"
        />
      </Layer>

      {loading && !value && <div>Loading...</div>}
    </Stack>
  );
};
CodeEditor.displayName = "CodeEditor";
