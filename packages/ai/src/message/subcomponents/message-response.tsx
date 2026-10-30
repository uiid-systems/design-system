import { Markdown } from "../../markdown/markdown";
import type { MessageResponseProps } from "../message.types";

export const MessageResponse = (props: MessageResponseProps) => (
  <Markdown data-slot="message-response" {...props} />
);
MessageResponse.displayName = "MessageResponse";
