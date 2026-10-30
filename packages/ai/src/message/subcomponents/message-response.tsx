import { memo } from "react";

import { Markdown } from "../../markdown/markdown";
import type { MessageResponseProps } from "../message.types";

/**
 * `Markdown` recompiles its string on every render, which is right for the
 * one message that is streaming and wasted for every finished message above
 * it that re-renders with the transcript on each token. The memo skips those.
 */
export const MessageResponse = memo((props: MessageResponseProps) => (
  <Markdown data-slot="message-response" {...props} />
));
MessageResponse.displayName = "MessageResponse";
