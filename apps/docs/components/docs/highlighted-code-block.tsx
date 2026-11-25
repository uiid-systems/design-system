import { CodeBlock, highlight, type CodeBlockProps } from "@uiid/design-system";

/**
 * Highlights on the server and passes the result as `html`, so CodeBlock skips
 * its client highlighter: the page ships no Shiki and shows colors on first paint.
 */
export async function HighlightedCodeBlock({
  code,
  language,
  highlightLines,
  ...props
}: Omit<CodeBlockProps, "html">) {
  // With no `language`, `highlight` uses the same default CodeBlock does.
  const html = await highlight(code, language, {
    highlightLines,
  });

  return (
    <CodeBlock
      code={code}
      language={language}
      highlightLines={highlightLines}
      html={html}
      // The docs keep the wrap and fullscreen buttons the library used to
      // show by default; a caller can still turn either off.
      wrappable
      fullscreenable
      {...props}
    />
  );
}
