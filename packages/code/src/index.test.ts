import { barrelExports } from "@uiid/config/scripts/barrel-exports.mjs";
// @vitest-environment node
import { describe, expect, it } from "vitest";

import * as code from "./index";

// Components, their parts and their prop types, plus the highlighter API:
// `highlight` for server rendering, the language helpers and `useHighlight`.
// Constants, variant functions and the module that lazy-loads Shiki are
// internal, though `getHighlighter` hands back Shiki's own highlighter.
const values = [
  "CodeBlock",
  "CodeBlockContent",
  "CodeBlockCopyButton",
  "CodeBlockExpandToggle",
  "CodeBlockFullscreenButton",
  "CodeBlockHeader",
  "CodeBlockWrapButton",
  "CodeEditor",
  "CodeInline",
  "CodePreview",
  "CodePreviewBar",
  "CodePreviewCanvas",
  "CodePreviewPanel",
  "CodePreviewResetButton",
  "CodePreviewTrigger",
  "LanguageIcon",
  "getHighlighter",
  "highlight",
  "isSupportedLanguage",
  "loadLanguage",
  "resolveLanguage",
  "useHighlight",
];

const types = [
  "BundledLanguage",
  "CodeBlockContentProps",
  "CodeBlockCopyButtonProps",
  "CodeBlockExpandToggleProps",
  "CodeBlockFullscreenButtonProps",
  "CodeBlockHeaderProps",
  "CodeBlockProps",
  "CodeBlockWrapButtonProps",
  "CodeEditorProps",
  "CodeEditorTextareaProps",
  "CodeInlineProps",
  "CodeLanguage",
  "CodePreviewBarProps",
  "CodePreviewCanvasProps",
  "CodePreviewPanelProps",
  "CodePreviewProps",
  "CodePreviewResetButtonProps",
  "CodePreviewTriggerProps",
  "HighlightOptions",
  "HighlightResult",
  "LanguageIconProps",
  "UseHighlightOptions",
];

describe("@uiid/code barrel", () => {
  it("exports exactly the components, parts and highlighter API", () => {
    expect(Object.keys(code).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
