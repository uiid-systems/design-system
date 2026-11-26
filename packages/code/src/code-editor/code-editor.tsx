"use client";

import { Stack, Layer } from "@uiid/layout";
import { cx, definedProps, useComposedRefs } from "@uiid/utils";
import { Fragment, useState, useCallback, useMemo, useRef } from "react";

import { CodeBlockHeader } from "../code-block/subcomponents/code-block-header";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_SHOW_LINE_NUMBERS,
  DEFAULT_COPYABLE,
  DEFAULT_CODE,
} from "../code.constants";
import { codeTypographyVariant, shikiVariants } from "../code.variants";
import { useHighlight } from "../highlighter/highlighter.hooks";
import type { CodeEditorProps } from "./code-editor.types";
import {
  normalizeLineEndings,
  parseMarkup,
  reusableLines,
} from "./code-editor.utils";

import blockStyles from "../code-block/code-block.module.css";
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

  // The text as the textarea holds it: a textarea turns CRLF and CR into LF, and
  // so does the HTML parser that reads the markup back, so both layers work in LF.
  const text = normalizeLineEndings(value);

  // Syntax highlighting. Notation comments stay as typed, so the highlight holds
  // exactly the textarea's text.
  const { html } = useHighlight(text, language, { notations: false });

  // The highlight lags the text by one pass. Each line whose text the last
  // highlight already paints keeps Shiki's markup for it; only a changed or new
  // line is painted as plain text until its highlight lands. So a typed
  // character shows in the frame it is typed, the rest keeps its colour, and the
  // layers always hold identical text.
  const markup = useMemo(() => parseMarkup(html), [html]);
  const lines = text.split("\n");
  const reused = markup ? reusableLines(markup.lines, lines) : [];
  const pending = !markup || reused.includes(undefined);

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
      data-readonly={readOnly || undefined}
      // CodeBlock's frame, so a block and an editor share one border, radius and surface
      className={cx(
        blockStyles["code-block"],
        styles["code-editor"],
        className,
      )}
      w="full"
      {...props}
    >
      {/* CodeBlock's header rule: a bar only with a filename (or a HeaderProps icon or
          children). Otherwise the copy button floats in the top-right corner, out of the
          flow, so the textarea never moves as the button comes and goes. */}
      <CodeBlockHeader
        {...HeaderProps}
        {...definedProps({ filename })}
        copyable={copyable}
        code={value}
        CopyButtonProps={CopyButtonProps}
        // The editor keeps only the copy button's width clear, so no other button floats
        wrappable={false}
        fullscreenable={false}
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
          inert
          data-slot="code-editor-highlight"
          data-pending={pending || undefined}
          className={cx(
            styles["code-editor-highlight"],
            // The editor draws its own line numbers in its gutter (see the CSS module)
            shikiVariants({ showLineNumbers: false }),
          )}
        >
          {/* Shiki's `<pre>` class and theme colours once a highlight has landed */}
          <pre
            className={markup ? markup.className : styles["code-editor-plain"]}
            style={markup?.style}
          >
            <code>
              {lines.map((line, index) => {
                const highlighted = reused[index];
                return (
                  <Fragment key={index}>
                    {index > 0 && "\n"}
                    {highlighted ? (
                      // Shiki's own markup for exactly this line's text
                      <span
                        key="highlighted"
                        className={highlighted.className}
                        dangerouslySetInnerHTML={{ __html: highlighted.html }}
                      />
                    ) : (
                      // The user's text as a text child, never as markup
                      <span key="plain" className="line">
                        {line}
                      </span>
                    )}
                  </Fragment>
                );
              })}
            </code>
          </pre>
        </div>

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
          onScroll={onTextareaScroll}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          // `rows` is the editor's own cap above, never the textarea's native height
          rows={undefined}
        />
      </Layer>
    </Stack>
  );
};
CodeEditor.displayName = "CodeEditor";
