"use client";

import { Button } from "@uiid/buttons";
import { Stack, Group, type StackProps } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";

type ChatMessageEmptyProps = StackProps;

const prompts = [
  "Create a login form",
  "Build a pricing card",
  "Make a settings panel",
];

export const ChatMessageEmpty = ({ ...props }: ChatMessageEmptyProps) => {
  const send = useChatStore((s) => s.send);

  return (
    <Stack
      data-slot="chat-message-empty"
      gap={4}
      ay="center"
      fullheight
      {...props}
    >
      <Text size={-1} shade="muted" weight="bold">
        Try a prompt:
      </Text>
      <Group gap={2} style={{ flexWrap: "wrap" }}>
        {prompts.map((prompt) => (
          <Button
            key={prompt}
            size="xsmall"
            variant="ghost"
            onClick={() => send(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </Group>
    </Stack>
  );
};
ChatMessageEmpty.displayName = "ChatMessageEmpty";
