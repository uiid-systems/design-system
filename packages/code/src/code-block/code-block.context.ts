import * as React from "react";

/**
 * The text CodeBlock's highlighted `html` was made from, which trails `code`
 * while a stream outruns the highlighter. CodeBlockContent shows the rest of
 * `code` after it uncolored. Unset outside CodeBlock, or for prerendered
 * `html`, and then nothing is added. Internal: not exported from the package.
 */
export const HighlightedCodeContext = React.createContext<string | undefined>(
  undefined,
);
