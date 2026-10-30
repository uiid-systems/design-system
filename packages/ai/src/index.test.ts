import * as ai from "@uiid/ai";
import { describe, expect, it } from "vitest";

describe("@uiid/ai barrel", () => {
  it("resolves from source and exports the Conversation parts, both hooks, Markdown, Message, PromptInput and Suggestion", () => {
    expect(Object.keys(ai).sort()).toEqual([
      "Conversation",
      "ConversationContent",
      "ConversationEmptyState",
      "ConversationScrollButton",
      "Markdown",
      "Message",
      "MessageContent",
      "MessageResponse",
      "PromptInput",
      "PromptInputSubmit",
      "Suggestion",
      "useConversation",
      "useStickToBottom",
    ]);
  });
});
