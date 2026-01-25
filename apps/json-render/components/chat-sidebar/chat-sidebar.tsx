"use client";

import { useRef, useEffect } from "react";

import { ChatSidebarContainer } from "./chat-sidebar-container";
import { ChatSidebarHeader } from "./chat-sidebar-header";

import { ChatMessageContainer } from "../chat-message-container";
import { ChatMessageEmpty } from "../chat-message-empty";
import { ChatMessageBubble } from "../chat-message-bubble";
import { ChatMessageError } from "../chat-message-error";
import { ChatInputContainer } from "../chat-input-container";
import { ChatInput } from "../chat-input";

import { useChatStore } from "@/lib/store";

export const ChatSidebar = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore((s) => s.messages);
  const error = useChatStore((s) => s.error);
  const send = useChatStore((s) => s.send);
  const isLoading = useChatStore((s) => s.isLoading);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatSidebarContainer>
      <ChatSidebarHeader />
      <ChatMessageContainer style={{ overflowY: "auto" }}>
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
    </ChatSidebarContainer>
  );
};
ChatSidebar.displayName = "ChatSidebar";
