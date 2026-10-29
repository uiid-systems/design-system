"use client";

import * as React from "react";

import type { UseStickToBottomReturn } from "./conversation.types";

export const ConversationContext =
  React.createContext<UseStickToBottomReturn | null>(null);

/** The `useStickToBottom` instance of the nearest `Conversation`. */
export function useConversation() {
  const context = React.useContext(ConversationContext);
  if (!context) {
    throw new Error("`useConversation` must be used within `Conversation`");
  }
  return context;
}
