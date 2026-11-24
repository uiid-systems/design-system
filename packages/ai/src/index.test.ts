// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as ai from "./index";

// Components, their parts and their prop types, plus the AI SDK shapes those
// props take. The scroll hooks behind Conversation, their return type and the
// constants are internal.
const values = [
  "Conversation",
  "ConversationContent",
  "ConversationEmptyState",
  "ConversationScrollButton",
  "Message",
  "MessageContent",
  "MessageResponse",
  "PromptInput",
  "PromptInputSubmit",
  "Reasoning",
  "Suggestion",
  "Tool",
];

const types = [
  // The AI SDK shapes
  "ChatRole",
  "ChatStatus",
  "ToolState",
  // Conversation
  "ConversationContentProps",
  "ConversationEmptyStateProps",
  "ConversationProps",
  "ConversationScrollButtonProps",
  // Message
  "MessageContentProps",
  "MessageProps",
  "MessageResponseProps",
  // PromptInput
  "PromptInputMessage",
  "PromptInputProps",
  "PromptInputSubmitProps",
  // Reasoning
  "ReasoningLabelState",
  "ReasoningProps",
  // Suggestion
  "SuggestionProps",
  // Tool
  "ToolLabels",
  "ToolPart",
  "ToolProps",
];

describe("@uiid/ai barrel", () => {
  it("exports exactly the components and parts", () => {
    expect(Object.keys(ai).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
