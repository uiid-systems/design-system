import type { MarkdownOverrides } from "@uiid/markdown";

import { ChatCodeBlock } from "./chat-code-block";

/** Defined once, so every code block keeps its instance across renders. */
const DEFAULT_OVERRIDES: MarkdownOverrides = { codeBlock: ChatCodeBlock };

/**
 * Each caller's object maps to one merged object, so a stable `overrides`
 * keeps `Markdown`'s memo hitting without a hook.
 */
const merged = new WeakMap<MarkdownOverrides, MarkdownOverrides>();

/**
 * The caller's overrides over the chat defaults. A key the caller sets wins,
 * so `{ codeBlock: undefined }` removes the code block and other keys keep it.
 */
export const withChatOverrides = (
  overrides?: MarkdownOverrides,
): MarkdownOverrides => {
  if (!overrides) return DEFAULT_OVERRIDES;
  let result = merged.get(overrides);
  if (!result) {
    result = { ...DEFAULT_OVERRIDES, ...overrides };
    merged.set(overrides, result);
  }
  return result;
};
