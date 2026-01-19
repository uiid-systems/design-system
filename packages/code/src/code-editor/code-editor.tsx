"use client";

import { useState, useCallback, useRef } from "react";

import { Stack, Layer } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { useHighlight } from "../highlighter/highlighter.hooks";
import { CodeBlockHeader } from "../code-block/subcomponents";

import type { CodeEditorProps } from "./code-editor.types";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_TAB_SIZE,
  DEFAULT_INSERT_SPACES,
  DEFAULT_SHOW_LINE_NUMBERS,
  DEFAULT_COPYABLE,
  DEFAULT_CODE,
  COMMENT_PREFIXES,
  COMMENT_SUFFIXES,
} from "./code-editor.constants";
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
  tabSize = DEFAULT_TAB_SIZE,
  insertSpaces = DEFAULT_INSERT_SPACES,
  fullwidth,
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

  // Update value
  const updateValue = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  // Handle text changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (readOnly) return;
      updateValue(e.target.value);
    },
    [readOnly, updateValue],
  );

  // Get indentation string
  const getIndent = useCallback(() => {
    return insertSpaces ? " ".repeat(tabSize) : "\t";
  }, [insertSpaces, tabSize]);

  // Get current line info
  const getLineInfo = useCallback((text: string, cursorPos: number) => {
    const beforeCursor = text.slice(0, cursorPos);
    const afterCursor = text.slice(cursorPos);

    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const lineEnd = afterCursor.indexOf("\n");
    const lineEndPos = lineEnd === -1 ? text.length : cursorPos + lineEnd;

    const currentLine = text.slice(lineStart, lineEndPos);
    const leadingWhitespace = currentLine.match(/^[\t ]*/)?.[0] || "";

    return {
      lineStart,
      lineEndPos,
      currentLine,
      leadingWhitespace,
      beforeCursor,
      afterCursor,
    };
  }, []);

  // Keyboard handler for IDE shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (readOnly || disabled) return;

      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd, value: text } = textarea;

      // Tab - insert indentation
      if (e.key === "Tab" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const indent = getIndent();

        if (e.shiftKey) {
          // Shift+Tab - dedent
          const { lineStart, currentLine } = getLineInfo(text, selectionStart);
          const indentMatch = currentLine.match(/^[\t ]+/);

          if (indentMatch) {
            const currentIndent = indentMatch[0];
            const removeAmount = Math.min(
              currentIndent.startsWith("\t") ? 1 : tabSize,
              currentIndent.length,
            );
            const newLine = currentLine.slice(removeAmount);
            const newText =
              text.slice(0, lineStart) +
              newLine +
              text.slice(lineStart + currentLine.length);

            updateValue(newText);

            // Adjust cursor position
            requestAnimationFrame(() => {
              const newPos = Math.max(lineStart, selectionStart - removeAmount);
              textarea.setSelectionRange(newPos, newPos);
            });
          }
        } else {
          // Tab - indent
          const newText =
            text.slice(0, selectionStart) + indent + text.slice(selectionEnd);
          updateValue(newText);

          requestAnimationFrame(() => {
            const newPos = selectionStart + indent.length;
            textarea.setSelectionRange(newPos, newPos);
          });
        }
        return;
      }

      // Enter - insert newline with auto-indent
      if (e.key === "Enter" && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        const { leadingWhitespace } = getLineInfo(text, selectionStart);

        const newText =
          text.slice(0, selectionStart) +
          "\n" +
          leadingWhitespace +
          text.slice(selectionEnd);

        updateValue(newText);

        requestAnimationFrame(() => {
          const newPos = selectionStart + 1 + leadingWhitespace.length;
          textarea.setSelectionRange(newPos, newPos);
        });
        return;
      }

      // Cmd/Ctrl+D - duplicate line
      if (e.key === "d" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        const { lineEndPos, currentLine } = getLineInfo(text, selectionStart);

        const newText =
          text.slice(0, lineEndPos) +
          "\n" +
          currentLine +
          text.slice(lineEndPos);

        updateValue(newText);

        requestAnimationFrame(() => {
          const newPos = selectionStart + currentLine.length + 1;
          textarea.setSelectionRange(newPos, newPos);
        });
        return;
      }

      // Cmd/Ctrl+/ - toggle line comment
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const commentPrefix = COMMENT_PREFIXES[language] || "//";
        const commentSuffix = COMMENT_SUFFIXES[language] || "";
        const { lineStart, lineEndPos, currentLine, leadingWhitespace } =
          getLineInfo(text, selectionStart);

        const trimmedLine = currentLine.trimStart();
        const isCommented = trimmedLine.startsWith(commentPrefix);

        let newLine: string;
        let cursorAdjust: number;

        if (isCommented) {
          // Uncomment
          const commentStart = currentLine.indexOf(commentPrefix);
          const afterComment = currentLine.slice(
            commentStart + commentPrefix.length,
          );
          // Remove suffix if present
          const withoutSuffix = commentSuffix
            ? afterComment.replace(
                new RegExp(
                  commentSuffix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
                ),
                "",
              )
            : afterComment;
          // Remove leading space after comment prefix if present
          const cleanedContent = withoutSuffix.startsWith(" ")
            ? withoutSuffix.slice(1)
            : withoutSuffix;

          newLine = leadingWhitespace + cleanedContent;
          cursorAdjust = -(
            commentPrefix.length + (withoutSuffix !== cleanedContent ? 1 : 0)
          );
        } else {
          // Comment
          newLine =
            leadingWhitespace +
            commentPrefix +
            " " +
            trimmedLine +
            commentSuffix;
          cursorAdjust = commentPrefix.length + 1;
        }

        const newText =
          text.slice(0, lineStart) + newLine + text.slice(lineEndPos);

        updateValue(newText);

        requestAnimationFrame(() => {
          const newPos = Math.max(lineStart, selectionStart + cursorAdjust);
          textarea.setSelectionRange(newPos, newPos);
        });
        return;
      }

      // Cmd/Ctrl+] - indent line
      if (e.key === "]" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const { lineStart, lineEndPos, currentLine } = getLineInfo(
          text,
          selectionStart,
        );
        const indent = getIndent();

        const newText =
          text.slice(0, lineStart) +
          indent +
          currentLine +
          text.slice(lineEndPos);

        updateValue(newText);

        requestAnimationFrame(() => {
          const newPos = selectionStart + indent.length;
          textarea.setSelectionRange(newPos, newPos);
        });
        return;
      }

      // Cmd/Ctrl+[ - dedent line
      if (e.key === "[" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const { lineStart, currentLine } = getLineInfo(text, selectionStart);
        const indentMatch = currentLine.match(/^[\t ]+/);

        if (indentMatch) {
          const currentIndent = indentMatch[0];
          const removeAmount = Math.min(
            currentIndent.startsWith("\t") ? 1 : tabSize,
            currentIndent.length,
          );
          const newLine = currentLine.slice(removeAmount);
          const lineEndPos = lineStart + currentLine.length;
          const newText =
            text.slice(0, lineStart) + newLine + text.slice(lineEndPos);

          updateValue(newText);

          requestAnimationFrame(() => {
            const newPos = Math.max(lineStart, selectionStart - removeAmount);
            textarea.setSelectionRange(newPos, newPos);
          });
        }
        return;
      }
    },
    [
      readOnly,
      disabled,
      getIndent,
      getLineInfo,
      updateValue,
      tabSize,
      language,
    ],
  );

  // Show header if filename or copyable
  const showHeader = filename || copyable;

  return (
    <Stack
      data-slot="code-editor"
      data-fullwidth={fullwidth || undefined}
      data-disabled={disabled || undefined}
      className={cx(styles["code-editor"], className)}
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
          data-line-numbers={showLineNumbers || undefined}
          className={styles["code-editor-highlight"]}
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
          onKeyDown={handleKeyDown}
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

      {loading && !value && (
        <Stack
          ay="center"
          ax="center"
          className={styles["code-editor-loading"]}
        >
          Loading...
        </Stack>
      )}
    </Stack>
  );
};
CodeEditor.displayName = "CodeEditor";
