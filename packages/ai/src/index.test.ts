import * as ai from "@uiid/ai";
import { describe, expect, it } from "vitest";

describe("@uiid/ai barrel", () => {
  it("resolves from source and exports the Conversation parts, both hooks, Markdown and PromptInput", () => {
    expect(Object.keys(ai).sort()).toEqual([
      "Conversation",
      "ConversationContent",
      "ConversationEmptyState",
      "ConversationScrollButton",
      "Markdown",
      "PromptInput",
      "PromptInputSubmit",
      "useConversation",
      "useStickToBottom",
    ]);
  });
});
