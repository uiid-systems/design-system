"use client";

import { Button } from "@uiid/buttons";
import { CopyIcon } from "@uiid/icons/copy";
import { RefreshCwIcon } from "@uiid/icons/refresh-cw";
import { ThumbsUpIcon } from "@uiid/icons/thumbs-up";
import { Group, Stack } from "@uiid/layout";
import { useEffect, useState } from "react";

import type { ChatRole } from "../ai.types";
import { Conversation } from "../conversation/conversation";
import {
  ConversationContent,
  ConversationScrollButton,
} from "../conversation/subcomponents";
import { Message } from "./message";
import type { MessageProps } from "./message.types";
import { MessageContent, MessageResponse } from "./subcomponents";

type Turn = { role: ChatRole; text: string };

const QUESTION = "What changes between a user and an assistant turn?";
const ANSWER =
  "Two things, both from one `data-from` attribute:\n\n- a **user** turn sits at the end of the column in a bubble\n- an **assistant** turn sits at the start as plain prose";

const EXCHANGE: Turn[] = [
  { role: "user", text: QUESTION },
  { role: "assistant", text: ANSWER },
];

const TRANSCRIPT: Turn[] = [
  ...EXCHANGE,
  { role: "user", text: "And a system message?" },
  {
    role: "assistant",
    text: "It renders like an assistant turn. Nothing in a chat column needs a third alignment.",
  },
  { role: "user", text: "Where do the copy and retry buttons go?" },
  {
    role: "assistant",
    text: "After `MessageContent`, inside the same `Message`, as a `Group` of ghost square `Button`s. They line up under the prose because the turn aligns its children to the start.",
  },
  { role: "user", text: "Does the response re-render on every token?" },
  {
    role: "assistant",
    text: "Only the one that is streaming. `MessageResponse` is memoized, so a finished message keeps its compiled markdown while the transcript around it updates.",
  },
];

/* One turn. The Playground's `from` control moves it between the two layouts. */
export const Basic = (props: Partial<MessageProps>) => (
  <Message from="assistant" {...props}>
    <MessageContent>
      <MessageResponse>{ANSWER}</MessageResponse>
    </MessageContent>
  </Message>
);

export const UserAndAssistant = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    {EXCHANGE.map((turn) => (
      <Message key={turn.role} from={turn.role}>
        <MessageContent>
          <MessageResponse>{turn.text}</MessageResponse>
        </MessageContent>
      </Message>
    ))}
  </Stack>
);

/* Replays the answer a few characters at a time, forever. */
export const Streaming = () => {
  const [draft, setDraft] = useState("");
  const done = draft.length >= ANSWER.length;

  useEffect(() => {
    const id = setTimeout(
      () => setDraft(done ? "" : ANSWER.slice(0, draft.length + 3)),
      done ? 1500 : 40,
    );
    return () => clearTimeout(id);
  }, [draft, done]);

  return (
    <Stack gap={4} ax="stretch" fullwidth>
      <Message from="user">
        <MessageContent>
          <MessageResponse>{QUESTION}</MessageResponse>
        </MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent>
          <MessageResponse streaming={!done}>{draft}</MessageResponse>
        </MessageContent>
      </Message>
    </Stack>
  );
};

/*
 * An actions row is a Group of plain Buttons, not a part. Ghost, square and
 * xsmall is its register, and a string tooltip also names each icon button.
 */
const Actions = ({ text }: { text: string }) => (
  <Group gap={1}>
    <Button
      variant="ghost"
      shape="square"
      size="xsmall"
      tooltip="Copy"
      onClick={() => void navigator.clipboard?.writeText(text)}
    >
      <CopyIcon />
    </Button>
    <Button variant="ghost" shape="square" size="xsmall" tooltip="Retry">
      <RefreshCwIcon />
    </Button>
    <Button
      variant="ghost"
      shape="square"
      size="xsmall"
      tooltip="Good response"
    >
      <ThumbsUpIcon />
    </Button>
  </Group>
);

export const WithActions = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    {EXCHANGE.map((turn) => (
      <Message key={turn.role} from={turn.role}>
        <MessageContent>
          <MessageResponse>{turn.text}</MessageResponse>
        </MessageContent>
        {turn.role === "assistant" && <Actions text={turn.text} />}
      </Message>
    ))}
  </Stack>
);

export const WithConversation = () => (
  <Conversation h={360}>
    <ConversationContent>
      {TRANSCRIPT.map((turn, index) => (
        <Message key={index} from={turn.role}>
          <MessageContent>
            <MessageResponse>{turn.text}</MessageResponse>
          </MessageContent>
          {turn.role === "assistant" && <Actions text={turn.text} />}
        </Message>
      ))}
    </ConversationContent>
    <ConversationScrollButton />
  </Conversation>
);
