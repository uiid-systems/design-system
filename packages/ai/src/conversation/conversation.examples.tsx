"use client";

import { MessageSquareIcon } from "@uiid/icons/message-square";
import { useEffect, useState } from "react";

import { Message } from "../message/message";
import { MessageContent, MessageResponse } from "../message/subcomponents";
import { Conversation } from "./conversation";
import type { ConversationProps } from "./conversation.types";
import {
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./subcomponents";

type Turn = { role: "user" | "assistant"; text: string };

const EXCHANGES: [string, string][] = [
  [
    "What does the scroll button do?",
    "It appears once you scroll up, and one press brings you **back to the newest message** and pins the view there again.",
  ],
  [
    "And while a reply is streaming?",
    "The region stays pinned, so each token lands in view:\n\n- content growing keeps the bottom visible\n- the region shrinking does too\n- scrolling up lets go, and nothing moves under you",
  ],
  [
    "How far do I have to scroll to release it?",
    "Past `70px` from the bottom. Scrolling back within that band pins it again without pressing anything.",
  ],
  [
    "Does it respect reduced motion?",
    "Yes. The button's scroll is smooth by default and instant under `prefers-reduced-motion`, through a single CSS rule.",
  ],
];

const TRANSCRIPT: Turn[] = EXCHANGES.flatMap(([user, assistant]) => [
  { role: "user", text: user },
  { role: "assistant", text: assistant },
]);

const MessageTurn = ({
  role,
  text,
  streaming = false,
}: Turn & { streaming?: boolean }) => (
  <Message from={role}>
    <MessageContent>
      <MessageResponse streaming={streaming}>{text}</MessageResponse>
    </MessageContent>
  </Message>
);

export const Basic = (props: ConversationProps) => (
  <Conversation h={360} {...props}>
    <ConversationContent>
      {TRANSCRIPT.map((turn, index) => (
        <MessageTurn key={index} {...turn} />
      ))}
    </ConversationContent>
    <ConversationScrollButton />
  </Conversation>
);

/**
 * Replays the transcript a few characters at a time, forever. Scroll up while
 * it runs to see the region let go and the button appear.
 */
export const Streaming = () => {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");

  const exchange = EXCHANGES[(turns.length / 2) % EXCHANGES.length];
  const reply = exchange[1];
  const done = draft.length >= reply.length;

  useEffect(() => {
    const id = setTimeout(
      () => {
        if (done) {
          setTurns((previous) => [
            ...previous,
            { role: "user", text: exchange[0] },
            { role: "assistant", text: reply },
          ]);
          setDraft("");
        } else {
          setDraft(reply.slice(0, draft.length + 3));
        }
      },
      done ? 1500 : 40,
    );
    return () => clearTimeout(id);
  }, [draft, done, exchange, reply]);

  return (
    <Conversation h={360}>
      <ConversationContent>
        {turns.map((turn, index) => (
          <MessageTurn key={index} {...turn} />
        ))}
        <MessageTurn role="user" text={exchange[0]} />
        <MessageTurn role="assistant" text={draft} streaming />
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

export const EmptyState = () => (
  <Conversation h={360}>
    <ConversationContent>
      <ConversationEmptyState icon={<MessageSquareIcon />} />
    </ConversationContent>
  </Conversation>
);
