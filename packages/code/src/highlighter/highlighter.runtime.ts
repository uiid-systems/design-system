/**
 * The Shiki runtime, loaded with `import()` the first time something is
 * highlighted. Importing it in one place keeps that load to a single request.
 *
 * Name each export rather than importing a Shiki package with `import()`
 * directly: a bundler keeps every export of a module loaded that way, and
 * these packages export far more than the highlighter uses.
 */
export {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";
export { createHighlighterCore } from "shiki/core";
export { createJavaScriptRegexEngine } from "shiki/engine/javascript";
