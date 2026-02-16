"use client";

import { useRef, useEffect, useState } from "react";

import { Button } from "@uiid/buttons";
import { MessageCircleIcon, XIcon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";

import { ChatMessageContainer } from "./chat-message-container";
import { ChatMessageEmpty } from "./chat-message-empty";
import { ChatMessageBubble } from "./chat-message-bubble";
import { ChatMessageError } from "./chat-message-error";
import { ChatInputContainer } from "./chat-input-container";
import { ChatInput } from "./chat-input";

import styles from "./chat-panel.module.css";

export const ChatPanel = () => {
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore((s) => s.messages);
  const error = useChatStore((s) => s.error);
  const send = useChatStore((s) => s.send);
  const isLoading = useChatStore((s) => s.isLoading);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {open && (
        <div className={styles.panel}>
          <Stack fullheight fullwidth ax="stretch">
            <Group
              ax="space-between"
              ay="center"
              px={4}
              py={2}
              className={styles.panelHeader}
            >
              <Text size={1} weight="bold">
                AI Assistant
              </Text>
              <Button
                size="xsmall"
                ghost
                square
                onClick={() => setOpen(false)}
              >
                <XIcon />
              </Button>
            </Group>
            <ChatMessageContainer
              style={{ overflowY: "auto", flex: 1 }}
            >
              {messages.length === 0 ? (
                <ChatMessageEmpty />
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ChatMessageContainer>
            {error && <ChatMessageError>{error}</ChatMessageError>}
            <ChatInputContainer>
              <ChatInput onSend={send} isLoading={isLoading} />
            </ChatInputContainer>
          </Stack>
        </div>
      )}
      <Button
        className={styles.toggle}
        onClick={() => setOpen((prev) => !prev)}
        square
        size="large"
        tone={open ? "info" : undefined}
      >
        <MessageCircleIcon />
      </Button>
    </>
  );
};
ChatPanel.displayName = "ChatPanel";
