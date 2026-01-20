/**
 * Custom hook for managing chat state and UI generation.
 *
 * Handles message history, streaming responses, and JSON tree extraction.
 * Persists state to localStorage and supports shareable URLs.
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { UITree } from "@json-render/core";
import type { CoreMessage } from "ai";

const STORAGE_KEY = "json-render-session";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tree?: UITree;
  timestamp: Date;
};

// Serializable version for storage
type StoredMessage = Omit<ChatMessage, "timestamp"> & { timestamp: string };

type StoredSession = {
  messages: StoredMessage[];
  tree: UITree | null;
};

export type UseChatOptions = {
  /** Initial UI tree */
  initialTree?: UITree;
  /** API endpoint for generation */
  endpoint?: string;
  /** Callback when tree is updated */
  onTreeUpdate?: (tree: UITree) => void;
  /** Storage key for persistence */
  storageKey?: string;
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
  /** Generate shareable URL for current tree */
  getShareUrl: () => string | null;
  /** Whether session was restored from storage */
  isRestored: boolean;
};

/**
 * Encode tree to URL-safe base64
 */
function encodeTree(tree: UITree): string {
  const json = JSON.stringify(tree);
  // Use base64 encoding
  return btoa(encodeURIComponent(json));
}

/**
 * Decode tree from URL-safe base64
 */
function decodeTree(encoded: string): UITree | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json);
    if (parsed.root && parsed.elements) {
      return parsed as UITree;
    }
  } catch {
    // Invalid encoding
  }
  return null;
}

/**
 * Get tree from URL hash if present
 */
function getTreeFromUrl(): UITree | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash) return null;
  return decodeTree(hash);
}

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
    storageKey = STORAGE_KEY,
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tree, setTreeState] = useState<UITree | null>(initialTree);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  // Track abort controller for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialized = useRef(false);

  // Load tree from URL hash
  const loadFromUrlHash = useCallback(() => {
    const urlTree = getTreeFromUrl();
    if (urlTree) {
      setTreeState(urlTree);
      setIsRestored(true);
      // Clear hash after loading
      window.history.replaceState(null, "", window.location.pathname);
      return true;
    }
    return false;
  }, []);

  // Load from URL hash or localStorage on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // First check URL for shared tree
    if (loadFromUrlHash()) return;

    // Then check localStorage for saved session
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const session: StoredSession = JSON.parse(stored);
        if (session.messages?.length > 0) {
          // Convert stored messages back to ChatMessage (restore Date objects)
          const restoredMessages: ChatMessage[] = session.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(restoredMessages);
        }
        if (session.tree) {
          setTreeState(session.tree);
        }
        setIsRestored(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey, loadFromUrlHash]);

  // Listen for hash changes and page focus (e.g., pasting a share URL)
  useEffect(() => {
    const handleHashChange = () => {
      loadFromUrlHash();
    };

    // Also check on focus in case URL was changed while tab was inactive
    const handleFocus = () => {
      if (window.location.hash) {
        loadFromUrlHash();
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("focus", handleFocus);
    
    // Check immediately in case hash is present but wasn't caught during init
    if (window.location.hash && !tree) {
      loadFromUrlHash();
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadFromUrlHash, tree]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isInitialized.current) return;

    try {
      const session: StoredSession = {
        messages: messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
        tree,
      };
      localStorage.setItem(storageKey, JSON.stringify(session));
    } catch {
      // Ignore storage errors (quota exceeded, etc.)
    }
  }, [messages, tree, storageKey]);

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

    // Clear localStorage
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const getShareUrl = useCallback(() => {
    if (!tree) return null;
    
    try {
      const encoded = encodeTree(tree);
      const url = new URL(window.location.href);
      url.hash = encoded;
      return url.toString();
    } catch {
      return null;
    }
  }, [tree]);

  return {
    messages,
    tree,
    isLoading,
    error,
    send,
    clear,
    setTree,
    getShareUrl,
    isRestored,
  };
}
