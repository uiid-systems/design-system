import * as ai from "@uiid/ai";
import { describe, expect, it } from "vitest";

describe("@uiid/ai barrel", () => {
  it("resolves from source and exports the Conversation parts, both hooks, Markdown, Message, PromptInput, Reasoning, Suggestion and Tool", () => {
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
      "Reasoning",
      "Suggestion",
      "Tool",
      "useConversation",
      "useStickToBottom",
    ]);
  });
});
