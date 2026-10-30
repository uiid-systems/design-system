import type { StackProps } from "@uiid/layout";

import type { ChatRole } from "../ai.types";
import type { MarkdownProps } from "../markdown/markdown.types";

export type MessageProps = StackProps & {
  /** Who sent the turn. Drives alignment and the content surface. */
  from: ChatRole;
};

/** The body of a turn. A user turn's content is the bubble. */
export type MessageContentProps = StackProps;

/** A streaming markdown reply. `Markdown` under the message's own slot. */
export type MessageResponseProps = MarkdownProps;
