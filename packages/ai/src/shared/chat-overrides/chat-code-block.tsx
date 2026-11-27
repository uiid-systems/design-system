import { CodeBlock } from "@uiid/code";
import type { MarkdownCodeBlockProps } from "@uiid/markdown";

/** Shiki's plain language: no grammar is loaded and no token is colored. */
const PLAIN_LANGUAGE = "text";

/**
 * A fenced block in a chat reply: the copy button and nothing else. CodeBlock
 * falls back to TypeScript, so a fence with no language is made plain here; an
 * unknown name already renders plain in CodeBlock.
 */
export const ChatCodeBlock = ({ code, language }: MarkdownCodeBlockProps) => (
  <CodeBlock code={code} language={language || PLAIN_LANGUAGE} />
);
ChatCodeBlock.displayName = "ChatCodeBlock";
