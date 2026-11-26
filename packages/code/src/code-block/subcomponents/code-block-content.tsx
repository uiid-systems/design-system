import { Stack } from "@uiid/layout";
import { cx, useComposedRefs } from "@uiid/utils";
import * as React from "react";

import { DEFAULT_SHOW_LINE_NUMBERS, DEFAULT_WRAP } from "../../code.constants";
import { codeContentVariants } from "../../code.variants";
import type { CodeBlockContentProps } from "../code-block.types";

import styles from "../code-block.module.css";

export const CodeBlockContent = ({
  html,
  code,
  showLineNumbers = DEFAULT_SHOW_LINE_NUMBERS,
  wrap = DEFAULT_WRAP,
  className,
  ref,
  ...props
}: CodeBlockContentProps) => {
  const ownRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ownRef, ref);
  // React rewrites `innerHTML` whenever this object changes, so it changes
  // only with `html`. Every other render leaves the markup, and the remainder
  // below, in place.
  const innerHtml = React.useMemo(() => ({ __html: html ?? "" }), [html]);

  // A stream can outrun the highlighter, leaving `html` for an earlier start
  // of `code`. Show the rest uncolored, before paint, so every character is
  // visible and nothing moves when the next pass lands.
  React.useLayoutEffect(() => {
    const el = html ? ownRef.current?.querySelector("pre code") : null;
    if (!el || !code) return;
    return appendRemainder(el, code);
  }, [html, code]);
  const sharedClass = cx(
    styles["code-block-content"],
    wrap && styles["code-block-content-wrap"],
    codeContentVariants({ showLineNumbers }),
    className,
  );
  const sharedAttrs = {
    "data-slot": "code-block-content",
    "data-line-numbers": showLineNumbers || undefined,
    "data-wrap": wrap || undefined,
    ax: "stretch" as const,
    w: "full" as const,
  };

  // Highlighted (shiki) path — preferred when html is available.
  if (html) {
    return (
      <Stack
        {...sharedAttrs}
        className={sharedClass}
        dangerouslySetInnerHTML={innerHtml}
        {...props}
        ref={composedRef}
      />
    );
  }

  // Unhighlighted fallback — same layout, no syntax colors. Used until the
  // highlighter finishes its async work so users don't see a flash of empty
  // space (or a "Loading..." string). It mirrors Shiki's markup: a newline
  // between the line spans is what breaks the rows inside the <pre>, and a
  // blank line is an empty span, so nothing moves when the colors land.
  const lines = (code ?? "").split("\n");
  return (
    <Stack
      {...sharedAttrs}
      className={sharedClass}
      {...props}
      ref={composedRef}
    >
      <pre>
        <code>
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && "\n"}
              <span className="line">{line}</span>
            </React.Fragment>
          ))}
        </code>
      </pre>
    </Stack>
  );
};
CodeBlockContent.displayName = "CodeBlockContent";

/**
 * Append the part of `code` past the highlighted text in `el` (Shiki's
 * `<code>`) as text nodes, in Shiki's line layout: the rest of the last line
 * joins its `.line` span, and each further line is a newline and a new one.
 * Does nothing unless the highlighted text starts `code`. Returns a cleanup
 * that removes what it added. React never reconciles inside `innerHTML`, so
 * these nodes are ours to add and remove.
 */
const appendRemainder = (el: Element, code: string) => {
  const highlighted = el.textContent;
  if (code.length <= highlighted.length || !code.startsWith(highlighted)) {
    return;
  }
  const doc = el.ownerDocument;
  const [rest, ...lines] = code.slice(highlighted.length).split("\n");
  const added: Node[] = [];
  const append = (parent: Element, node: Node) => {
    parent.append(node);
    added.push(node);
  };

  const last = el.lastElementChild;
  const lastLine = last?.classList.contains("line") ? last : el;
  if (rest) append(lastLine, doc.createTextNode(rest));
  for (const line of lines) {
    append(el, doc.createTextNode("\n"));
    const span = doc.createElement("span");
    span.className = "line";
    span.textContent = line;
    append(el, span);
  }
  return () => {
    for (const node of added) node.parentNode?.removeChild(node);
  };
};
