"use client";

import { Stack } from "@uiid/layout";
import { useEffect, useState } from "react";

import type { ToolState } from "../ai.types";
import { Message } from "../message/message";
import { MessageContent, MessageResponse } from "../message/subcomponents";
import { Reasoning } from "../reasoning/reasoning";
import { Tool } from "./tool";
import type { ToolPart, ToolProps } from "./tool.types";

const INPUT = { query: "weather in Lisbon", units: "celsius" };
const OUTPUT = { temperature: 21, condition: "Clear", wind: "12 km/h NW" };

const SEARCH: ToolPart = {
  type: "tool-search",
  state: "output-available",
  input: INPUT,
  output: OUTPUT,
};

/* One part per state, with the input and output each state can carry. */
const PARTS: Record<ToolState, ToolPart> = {
  "input-streaming": {
    ...SEARCH,
    state: "input-streaming",
    input: { query: "weath" },
    output: undefined,
  },
  "input-available": { ...SEARCH, state: "input-available", output: undefined },
  "approval-requested": {
    ...SEARCH,
    state: "approval-requested",
    output: undefined,
  },
  "approval-responded": {
    ...SEARCH,
    state: "approval-responded",
    output: undefined,
  },
  "output-available": SEARCH,
  "output-error": {
    ...SEARCH,
    state: "output-error",
    output: undefined,
    errorText: "Rate limit exceeded. Retry in 30 seconds.",
  },
  "output-denied": { ...SEARCH, state: "output-denied", output: undefined },
};

const LIFECYCLE: ToolState[] = [
  "input-streaming",
  "input-available",
  "output-available",
];

/* One finished call. The Playground's `part` control edits the object. */
export const Basic = ({ part = SEARCH, ...props }: Partial<ToolProps>) => (
  <Tool part={part} {...props} />
);

export const States = () => (
  <Stack gap={3} ax="stretch" fullwidth>
    {Object.values(PARTS).map((part) => (
      <Tool key={part.state} part={part} />
    ))}
  </Stack>
);

/* Walks one call from a streaming input to its result, open, then starts over. */
export const Lifecycle = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setTimeout(
      () => setStep((n) => (n + 1) % LIFECYCLE.length),
      step === LIFECYCLE.length - 1 ? 4000 : 1500,
    );
    return () => clearTimeout(id);
  }, [step]);

  return <Tool part={PARTS[LIFECYCLE[step]]} defaultOpen />;
};

/* Reasoning, the tool call, then the reply, in the order the model produced them. */
export const InMessage = () => (
  <Message from="assistant">
    <Reasoning duration={2}>
      {"The question needs live data, so a search comes before the answer."}
    </Reasoning>
    <Tool part={SEARCH} />
    <MessageContent>
      <MessageResponse>
        {
          "It is **21 °C** and clear in Lisbon, with a light wind from the northwest."
        }
      </MessageResponse>
    </MessageContent>
  </Message>
);
