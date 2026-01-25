/**
 * Zustand store for chat state and UI generation.
 *
 * Manages message history, streaming responses, and JSON tree extraction.
 * Persists state to localStorage and supports shareable URLs.
 */

import type { UITree } from "@json-render/core";
import type { CoreMessage } from "ai";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "json-render-session";
const API_ENDPOINT = "/api/generate";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tree?: UITree;
  timestamp: Date;
};

// Serializable version for storage
type StoredMessage = Omit<ChatMessage, "timestamp"> & { timestamp: string };

type ChatState = {
  messages: ChatMessage[];
  tree: UITree | null;
  isLoading: boolean;
  error: string | null;
  isRestored: boolean;
};

type ChatActions = {
  send: (prompt: string) => Promise<void>;
  clear: () => void;
  setTree: (tree: UITree) => void;
  getShareUrl: () => string | null;
  loadFromUrlHash: () => boolean;
  pushTreeToHistory: () => void;
  syncTreeToHash: () => void;
  setError: (error: string | null) => void;
};

type ChatStore = ChatState & ChatActions;

// Track abort controller outside store to avoid serialization issues
let abortController: AbortController | null = null;

/**
 * Encode tree to URL-safe base64
 */
function encodeTree(tree: UITree): string {
  const json = JSON.stringify(tree);
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
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  return decodeTree(hash);
}

/**
 * Extract JSON tree from response text.
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

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // State
      messages: [],
      tree: null,
      isLoading: false,
      error: null,
      isRestored: false,

      // Actions
      setError: (error) => set({ error }),

      setTree: (tree) => set({ tree }),

      loadFromUrlHash: () => {
        const urlTree = getTreeFromUrl();
        if (urlTree) {
          set({ tree: urlTree, isRestored: true });
          // Don't clear hash - URL should always reflect state
          return true;
        }
        return false;
      },

      pushTreeToHistory: () => {
        const { tree } = get();
        if (!tree || typeof window === "undefined") return;

        try {
          const encoded = encodeTree(tree);
          const url = new URL(window.location.href);
          url.hash = encoded;
          window.history.pushState({ tree: true }, "", url.toString());
        } catch {
          // Ignore encoding errors
        }
      },

      syncTreeToHash: () => {
        const { tree } = get();
        if (typeof window === "undefined") return;

        try {
          const url = new URL(window.location.href);
          if (tree) {
            url.hash = encodeTree(tree);
          } else {
            url.hash = "";
          }
          // Use replaceState so we don't spam history
          window.history.replaceState(window.history.state, "", url.toString());
        } catch {
          // Ignore encoding errors
        }
      },

      getShareUrl: () => {
        const { tree } = get();
        if (!tree) return null;

        try {
          const encoded = encodeTree(tree);
          const url = new URL(window.location.href);
          url.hash = encoded;
          return url.toString();
        } catch {
          return null;
        }
      },

      clear: () => {
        abortController?.abort();
        set({
          messages: [],
          tree: null,
          error: null,
          isLoading: false,
        });
      },

      send: async (prompt: string) => {
        const { isLoading, messages, tree } = get();
        if (!prompt.trim() || isLoading) return;

        set({ error: null, isLoading: true });

        // Add user message
        const userMessage: ChatMessage = {
          id: generateId(),
          role: "user",
          content: prompt,
          timestamp: new Date(),
        };

        // Create assistant message placeholder
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        set({ messages: [...messages, userMessage, assistantMessage] });

        // Build history for context
        const history: CoreMessage[] = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        try {
          abortController = new AbortController();

          const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt,
              history,
              currentTree: tree,
            }),
            signal: abortController.signal,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) throw new Error("No response body");

          const decoder = new TextDecoder();
          let fullContent = "";

          let finalTree: UITree | null = null;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;

            // Update assistant message with accumulated content
            set((state) => ({
              messages: state.messages.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: fullContent }
                  : msg
              ),
            }));

            // Try to extract tree from accumulated content
            const extractedTree = extractTree(fullContent);
            if (extractedTree) {
              finalTree = extractedTree;
              set((state) => ({
                tree: extractedTree,
                messages: state.messages.map((msg) =>
                  msg.id === assistantMessage.id
                    ? { ...msg, tree: extractedTree }
                    : msg
                ),
              }));
            }
          }

          // Push to browser history after successful generation
          if (finalTree) {
            get().pushTreeToHistory();
          }
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            return;
          }

          const errorMessage =
            err instanceof Error ? err.message : "Failed to generate UI";
          set({ error: errorMessage });

          // Update assistant message with error
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: `Error: ${errorMessage}` }
                : msg
            ),
          }));
        } finally {
          set({ isLoading: false });
          abortController = null;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage, {
        replacer: (_key, value) => {
          // Convert Date to ISO string for storage
          if (value instanceof Date) {
            return { __type: "Date", value: value.toISOString() };
          }
          return value;
        },
        reviver: (_key, value: unknown) => {
          // Convert ISO string back to Date
          if (
            value &&
            typeof value === "object" &&
            (value as { __type?: string }).__type === "Date"
          ) {
            return new Date((value as { value: string }).value);
          }
          return value;
        },
      }),
      partialize: (state) => ({
        messages: state.messages,
        tree: state.tree,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isRestored = true;
        }
      },
    }
  )
);
