/**
 * Custom hook for managing chat state and UI generation.
 *
 * Handles message history, streaming responses, and JSON tree extraction.
 */

"use client";

import { useState, useCallback, useRef } from "react";
import type { UITree } from "@json-render/core";
import type { CoreMessage } from "ai";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tree?: UITree;
  timestamp: Date;
};

export type UseChatOptions = {
  /** Initial UI tree */
  initialTree?: UITree;
  /** API endpoint for generation */
  endpoint?: string;
  /** Callback when tree is updated */
  onTreeUpdate?: (tree: UITree) => void;
};

export type UseChatReturn = {
  /** Chat messages */
  messages: ChatMessage[];
  /** Current UI tree */
  tree: UITree | null;
  /** Whether a request is in progress */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Send a message */
  send: (prompt: string) => Promise<void>;
  /** Clear chat history */
  clear: () => void;
  /** Set tree directly (for manual edits) */
  setTree: (tree: UITree) => void;
};

/**
 * Extract JSON tree from response text.
 * Looks for JSON wrapped in code blocks or raw JSON.
 */
function extractTree(text: string): UITree | null {
  // Try to find JSON in code block first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (parsed.root && parsed.elements) {
        return parsed as UITree;
      }
    } catch {
      // Not valid JSON in code block
    }
  }

  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*"root"[\s\S]*"elements"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.root && parsed.elements) {
        return parsed as UITree;
      }
    } catch {
      // Not valid JSON
    }
  }

  return null;
}

/**
 * Generate a unique message ID.
 */
function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Custom hook for chat-based UI generation.
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    initialTree = null,
    endpoint = "/api/generate",
    onTreeUpdate,
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tree, setTreeState] = useState<UITree | null>(initialTree);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track abort controller for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const setTree = useCallback(
    (newTree: UITree) => {
      setTreeState(newTree);
      onTreeUpdate?.(newTree);
    },
    [onTreeUpdate]
  );

  const send = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || isLoading) return;

      setError(null);
      setIsLoading(true);

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: prompt,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Create assistant message placeholder
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Build history for context (exclude the placeholder)
      const history: CoreMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      try {
        // Create abort controller
        abortControllerRef.current = new AbortController();

        console.log("[useChat] Sending request to:", endpoint);
        console.log("[useChat] Payload:", { prompt, historyLength: history.length, hasTree: !!tree });

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            history,
            currentTree: tree,
          }),
          signal: abortControllerRef.current.signal,
        });

        console.log("[useChat] Response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log("[useChat] Error response:", errorData);
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        // Read streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");
        
        console.log("[useChat] Starting to read stream...");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("[useChat] Stream complete, total length:", fullContent.length);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          console.log("[useChat] Received chunk, total length now:", fullContent.length);

          // Update assistant message with accumulated content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: fullContent }
                : msg
            )
          );

          // Try to extract tree from accumulated content
          const extractedTree = extractTree(fullContent);
          if (extractedTree) {
            setTree(extractedTree);

            // Update message with tree reference
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, tree: extractedTree }
                  : msg
              )
            );
          }
        }
      } catch (err) {
        console.error("[useChat] Error caught:", err);
        
        if (err instanceof Error && err.name === "AbortError") {
          // Request was cancelled, not an error
          console.log("[useChat] Request was aborted");
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate UI";
        console.error("[useChat] Setting error:", errorMessage);
        setError(errorMessage);

        // Update assistant message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: `Error: ${errorMessage}` }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [endpoint, isLoading, messages, tree, setTree]
  );

  const clear = useCallback(() => {
    // Cancel any in-progress request
    abortControllerRef.current?.abort();

    setMessages([]);
    setTreeState(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    messages,
    tree,
    isLoading,
    error,
    send,
    clear,
    setTree,
  };
}
