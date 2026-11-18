import {
  CodeBlock,
  DEFAULT_LANGUAGE,
  highlight,
  type CodeBlockProps,
} from "@uiid/design-system";

/**
 * Highlights on the server and passes the result as `html`, so CodeBlock skips
 * its client highlighter: the page ships no Shiki and shows colors on first paint.
 */
export async function HighlightedCodeBlock({
  code,
  language,
  highlightLines,
  ...props
}: CodeBlockProps) {
  const html = await highlight(code, language ?? DEFAULT_LANGUAGE, {
    highlightLines,
  });

  return (
    <CodeBlock
      code={code}
      language={language}
      highlightLines={highlightLines}
      html={html}
      {...props}
    />
  );
}
