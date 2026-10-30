"use client";

import { useEffect, useState } from "react";

import { Message } from "../message/message";
import { MessageContent, MessageResponse } from "../message/subcomponents";
import { Reasoning } from "./reasoning";
import type { ReasoningProps } from "./reasoning.types";

const STEPS =
  "The user wants the difference between the two layouts, not a tour of the props.\n\n1. Name the one attribute that drives both\n2. Show each layout in a sentence\n3. Leave the actions row for a follow-up";

const REPLY =
  "Both come from one `data-from` attribute: a **user** turn sits at the end of the column in a bubble, and an **assistant** turn sits at the start as plain prose.";

/* A finished block. The Playground's controls move its label and open state. */
export const Basic = ({
  children = STEPS,
  ...props
}: Partial<ReasoningProps>) => (
  <Reasoning duration={4} {...props}>
    {children}
  </Reasoning>
);

/*
 * Replays the reasoning a few characters at a time: the label shimmers and the
 * panel is open while it streams, then reads the duration and closes a second
 * later. Each run is a fresh block, keyed on the turn, as a new message would be.
 */
export const Streaming = () => {
  const [turn, setTurn] = useState(0);
  const [draft, setDraft] = useState("");
  const done = draft.length >= STEPS.length;

  useEffect(() => {
    const id = setTimeout(
      () => {
        if (done) {
          setTurn((n) => n + 1);
          setDraft("");
        } else {
          setDraft(STEPS.slice(0, draft.length + 3));
        }
      },
      done ? 4000 : 60,
    );
    return () => clearTimeout(id);
  }, [draft, done]);

  return (
    <Reasoning key={turn} streaming={!done}>
      {draft}
    </Reasoning>
  );
};

/* Above the reply, inside the same turn, so it lines up with the prose. */
export const InMessage = () => (
  <Message from="assistant">
    <Reasoning duration={3}>{STEPS}</Reasoning>
    <MessageContent>
      <MessageResponse>{REPLY}</MessageResponse>
    </MessageContent>
  </Message>
);
