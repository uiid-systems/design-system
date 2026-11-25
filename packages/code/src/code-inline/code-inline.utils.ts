// The start of a `<code>` or `</code>` tag in any case, not of a longer name
// like `<codex>`. The close is global so a search can walk to the last one.
const CODE_OPEN = /<code(?=[\s/>])/i;
const CODE_CLOSE = /<\/code(?=[\s>])/gi;

/**
 * Returns the markup inside the `<code>` element of Shiki's HTML, whatever
 * wraps it and whatever attributes its tags carry. Returns `null` when the
 * HTML holds no complete `<code>…</code>`, so the caller can render its plain
 * children instead.
 *
 * Assumes Shiki-shaped input: one `<code>` element, with `<` escaped in the
 * highlighted text, so the last `</code>` closes the element the first
 * `<code>` opened. With several code elements it spans from the first open to
 * the last close. It does not sanitize: the markup it returns is rendered as
 * HTML, so it must come from a trusted highlighter.
 */
export function extractCodeContent(html: string): string | null {
  const open = CODE_OPEN.exec(html);
  if (!open) return null;

  // Find the `>` that ends the opening tag, skipping any inside a quoted value.
  let quote: string | null = null;
  let i = open.index + open[0].length;
  for (; i < html.length; i++) {
    const char = html[i];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === ">") {
      break;
    }
  }
  if (i >= html.length) return null;

  // Search the original string, not a lowercased copy: lowercasing can change
  // its length and so every index after the change.
  const start = i + 1;
  let end = -1;
  for (const close of html.matchAll(CODE_CLOSE)) end = close.index;
  return end < start ? null : html.slice(start, end);
}
