"use client";

import { Button } from "@uiid/buttons";
import { GlobeIcon } from "@uiid/icons/globe";
import { MicIcon } from "@uiid/icons/mic";
import { PaperclipIcon } from "@uiid/icons/paperclip";
import { SparklesIcon } from "@uiid/icons/sparkles";
import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useEffect, useState } from "react";

import type { ChatStatus } from "../ai.types";
import { Conversation } from "../conversation/conversation";
import {
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "../conversation/subcomponents";
import { Markdown } from "../markdown/markdown";
import { PromptInput } from "./prompt-input";
import type { PromptInputProps } from "./prompt-input.types";

const STATUSES: ChatStatus[] = ["ready", "submitted", "streaming", "error"];

const REPLY =
  "Enter sends, **Shift+Enter** adds a line, and while this streams the arrow is a square you can press to stop.";

const Tools = () => (
  <>
    <Button variant="ghost" shape="square" size="xsmall" tooltip="Attach">
      <PaperclipIcon />
    </Button>
    <Button variant="ghost" shape="square" size="xsmall" tooltip="Search">
      <GlobeIcon />
    </Button>
    <Button variant="ghost" shape="square" size="xsmall" tooltip="Dictate">
      <MicIcon />
    </Button>
  </>
);

export const Basic = (props: Partial<PromptInputProps>) => {
  const [sent, setSent] = useState<string | null>(null);

  return (
    <Stack gap={3} ax="stretch" fullwidth>
      <PromptInput onSubmit={({ text }) => setSent(text)} {...props} />
      <Text size={-1} color="neutral">
        {sent ? `Sent: ${sent}` : "Nothing sent yet"}
      </Text>
    </Stack>
  );
};

/* Anything goes in the header: chips for attachments, a mode, a model. */
export const WithHeader = () => (
  <PromptInput
    onSubmit={() => {}}
    header={
      <>
        <Button size="xsmall" variant="subtle" shape="pill">
          <PaperclipIcon />
          brief.pdf
        </Button>
        <Button size="xsmall" variant="subtle" shape="pill">
          <SparklesIcon />
          Concise
        </Button>
      </>
    }
  />
);

/* Tools are plain Buttons. Ghost, square and xsmall is the footer's register. */
export const WithTools = () => (
  <PromptInput onSubmit={() => {}} tools={<Tools />} />
);

/* One composer per ChatStatus, so the submit button's four faces sit side by side. */
export const Statuses = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    {STATUSES.map((status) => (
      <Stack key={status} gap={1} ax="stretch">
        <Text size={-1} color="neutral" uppercase>
          {status}
        </Text>
        <PromptInput
          status={status}
          onSubmit={() => {}}
          onStop={() => {}}
          defaultValue="A message waiting to go"
        />
      </Stack>
    ))}
  </Stack>
);

/* With `value` set, the composer leaves clearing to its owner. */
export const Controlled = () => {
  const [value, setValue] = useState("");

  return (
    <Stack gap={3} ax="stretch" fullwidth>
      <PromptInput
        value={value}
        onValueChange={setValue}
        onSubmit={() => setValue("")}
      />
      <Text size={-1} color="neutral">
        {value.length} characters
      </Text>
    </Stack>
  );
};

export const Disabled = () => (
  <PromptInput disabled onSubmit={() => {}} tools={<Tools />} />
);

type Turn = { role: "user" | "assistant"; text: string };

/**
 * A chat: the transcript above, the composer below. Sending moves the status
 * through `submitted` and `streaming` and back to `ready`, and the
 * conversation stays pinned to the reply as it arrives.
 */
export const WithConversation = () => {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (status === "submitted") {
      const id = setTimeout(() => setStatus("streaming"), 600);
      return () => clearTimeout(id);
    }
    if (status === "streaming") {
      if (draft.length >= REPLY.length) {
        setTurns((previous) => [
          ...previous,
          { role: "assistant", text: REPLY },
        ]);
        setDraft("");
        setStatus("ready");
        return;
      }
      const id = setTimeout(
        () => setDraft(REPLY.slice(0, draft.length + 3)),
        40,
      );
      return () => clearTimeout(id);
    }
  }, [status, draft]);

  return (
    <Stack gap={3} ax="stretch" fullwidth>
      <Conversation h={280}>
        <ConversationContent>
          {turns.length === 0 && status === "ready" ? (
            <ConversationEmptyState description="Send a message to see the composer cycle through its states" />
          ) : (
            turns.map((turn, index) => (
              <Stack key={index} gap={1}>
                <Text size={-1} color="neutral" uppercase>
                  {turn.role}
                </Text>
                {turn.role === "user" ? (
                  <Text render={<p />}>{turn.text}</Text>
                ) : (
                  <Markdown>{turn.text}</Markdown>
                )}
              </Stack>
            ))
          )}
          {status === "streaming" && (
            <Stack gap={1}>
              <Text size={-1} color="neutral" uppercase>
                assistant
              </Text>
              <Markdown streaming>{draft}</Markdown>
            </Stack>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput
        status={status}
        tools={<Tools />}
        onSubmit={({ text }) => {
          setTurns((previous) => [...previous, { role: "user", text }]);
          setStatus("submitted");
        }}
        onStop={() => {
          setDraft("");
          setStatus("ready");
        }}
      />
    </Stack>
  );
};
