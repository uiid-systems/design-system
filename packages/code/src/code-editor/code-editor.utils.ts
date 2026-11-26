/** One line of highlighter markup: Shiki's own markup for exactly `text`. */
export type MarkupLine = {
  className: string;
  html: string;
  text: string;
};

/** Highlighter markup taken apart into its `<pre>` and its lines. */
export type ParsedMarkup = {
  className: string;
  /** The `<pre>`'s inline declarations, which Shiki writes (its theme colours) */
  style: Record<string, string>;
  lines: MarkupLine[];
};

/** Turns any CRLF or lone CR into LF, as a textarea does with its value. */
export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

/** `background-color` to `backgroundColor`; custom properties stay as written. */
const toStyleKey = (name: string) =>
  name.startsWith("--")
    ? name
    : name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

/**
 * Takes highlighter markup apart into its `<pre>` and one entry per line, each
 * with Shiki's markup for that line and the text it paints. The markup is
 * parsed in an inert `<template>`, so nothing in it runs or loads. Returns
 * `null` for no markup, and on the server, where there is no document.
 */
export function parseMarkup(html: string): ParsedMarkup | null {
  if (!html || typeof document === "undefined") return null;
  const template = document.createElement("template");
  template.innerHTML = html;
  const pre = template.content.querySelector("pre");
  const code = pre?.querySelector("code");
  if (!pre || !code) return null;

  const style: Record<string, string> = {};
  for (const declaration of (pre.getAttribute("style") ?? "").split(";")) {
    const colon = declaration.indexOf(":");
    if (colon > 0) {
      style[toStyleKey(declaration.slice(0, colon).trim())] = declaration
        .slice(colon + 1)
        .trim();
    }
  }

  const lines = [...code.children]
    .filter((element) => element.classList.contains("line"))
    .map((element) => ({
      className: element.className,
      html: element.innerHTML,
      text: element.textContent ?? "",
    }));
  return { className: pre.className, style, lines };
}

/**
 * For each line of the current text, the markup line that paints exactly that
 * text, or `undefined` where none does. Lines match from the start and from the
 * end, so an edit leaves the lines before and after it highlighted, including
 * when it adds or removes lines.
 */
export function reusableLines(
  markup: MarkupLine[],
  lines: string[],
): (MarkupLine | undefined)[] {
  const shorter = Math.min(markup.length, lines.length);
  let head = 0;
  while (head < shorter && markup[head]!.text === lines[head]) head++;
  let tail = 0;
  while (
    tail < shorter - head &&
    markup[markup.length - 1 - tail]!.text === lines[lines.length - 1 - tail]
  ) {
    tail++;
  }
  const shift = markup.length - lines.length;
  return lines.map((_, index) => {
    if (index < head) return markup[index];
    if (index >= lines.length - tail) return markup[index + shift];
    return undefined;
  });
}
