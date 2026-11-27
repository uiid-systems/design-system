import { Markdown } from "@uiid/markdown";

import { withChatOverrides } from "../../shared/chat-overrides/chat-overrides";
import type { MessageResponseProps } from "../message.types";

export const MessageResponse = ({
  overrides,
  ...props
}: MessageResponseProps) => (
  <Markdown
    data-slot="message-response"
    overrides={withChatOverrides(overrides)}
    {...props}
  />
);
MessageResponse.displayName = "MessageResponse";
