"use client";

import { Card } from "@uiid/cards";
import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import type { ChatMessage } from "@/lib/use-chat";

/**
 * Strip JSON code blocks from message content for cleaner chat display.
 * The code is already shown in the output tabs.
 */
function stripCodeBlocks(content: string): string {
  // Remove ```json ... ``` blocks
  return content.replace(/```(?:json)?\s*[\s\S]*?```/g, "").trim();
}

export const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  // For assistant messages, strip out code blocks to keep it conversational
  const displayContent = isUser
    ? message.content
    : stripCodeBlocks(message.content) || "Thinking...";

  return (
    <Stack
      gap={4}
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "85%",
      }}
    >
      <Text size={-1} shade="muted">
        {isUser ? "You" : "Assistant"}
      </Text>
      <Card ghost={isUser}>
        <Text style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {displayContent}
        </Text>
      </Card>
    </Stack>
  );
};
ChatMessageBubble.displayName = "ChatMessageBubble";
