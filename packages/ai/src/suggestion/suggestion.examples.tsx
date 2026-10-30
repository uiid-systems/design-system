"use client";

import { MessageSquareIcon } from "@uiid/icons/message-square";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Conversation } from "../conversation/conversation";
import {
  ConversationContent,
  ConversationEmptyState,
} from "../conversation/subcomponents";
import { Suggestion } from "./suggestion";
import type { SuggestionProps } from "./suggestion.types";

const SUGGESTIONS = [
  "Summarize this page",
  "Explain it simply",
  "Draft a reply",
  "Find the bug",
];

/* The text is `children`; the handler closes over it in the map. */
export const Basic = (props: Partial<SuggestionProps>) => {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <Stack gap={3} ax="stretch" fullwidth>
      <Group gap={2} wrap>
        {SUGGESTIONS.map((text) => (
          <Suggestion key={text} onClick={() => setPicked(text)} {...props}>
            {text}
          </Suggestion>
        ))}
      </Group>
      <Text size={-1} color="neutral">
        {picked ? `Sent: ${picked}` : "Pick a suggestion"}
      </Text>
    </Stack>
  );
};

/* Pills sit at the foot of the empty region, where the first message will land. */
export const WithEmptyState = () => (
  <Conversation h={360}>
    <ConversationContent>
      <ConversationEmptyState icon={<MessageSquareIcon />} />
      <Group gap={2} wrap ax="center">
        {SUGGESTIONS.map((text) => (
          <Suggestion key={text}>{text}</Suggestion>
        ))}
      </Group>
    </ConversationContent>
  </Conversation>
);
