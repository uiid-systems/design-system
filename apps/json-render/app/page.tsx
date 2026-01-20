"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { registry } from "@/lib/components";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";
import { useChat } from "@/lib/use-chat";

import {
  ChatOuterContainer,
  ChatSidebarContainer,
  ChatSidebarHeader,
  ChatSidebarActions,
  ChatMessageEmpty,
  ChatMessageContainer,
  ChatMessageBubble,
  ChatMessageError,
  ChatInputContainer,
  ChatInput,
  RenderedContainer,
} from "@/components";

export default function PlaygroundPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    tree,
    isLoading,
    error,
    send,
    clear,
    setTree,
    getShareUrl,
  } = useChat();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = getShareUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // JSON editor state (for manual editing)
  // Initialize from tree, but allow manual edits
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [jsxCode, setJsxCode] = useState("");
  const lastTreeRef = useRef<UITree | null>(null);

  // Derive JSON from tree (only when tree actually changes from AI)
  const treeJson = useMemo(() => {
    return tree ? JSON.stringify(tree, null, 2) : "";
  }, [tree]);

  // Sync JSON input when tree changes from AI (not from manual edits)
  useEffect(() => {
    if (tree && tree !== lastTreeRef.current) {
      lastTreeRef.current = tree;
      // Use a microtask to avoid the lint warning about synchronous setState
      queueMicrotask(() => setJsonInput(treeJson));
    } else if (!tree && lastTreeRef.current) {
      // Tree was cleared (e.g., "Start fresh")
      lastTreeRef.current = null;
      queueMicrotask(() => {
        setJsonInput("");
        setParseError(null);
      });
    }
  }, [tree, treeJson]);

  // Generate JSX when tree changes
  useEffect(() => {
    if (tree) {
      treeToFormattedJsx(tree).then((jsx) => {
        queueMicrotask(() => setJsxCode(jsx));
      });
    } else {
      queueMicrotask(() => setJsxCode(""));
    }
  }, [tree]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse JSON and update tree from manual edits
  const handleParseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput) as UITree;
      setTree(parsed);
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <JSONUIProvider
      registry={registry}
      actionHandlers={{
        submit: async () => {
          alert("Submit action triggered!");
        },
        reset: async () => {
          alert("Reset action triggered!");
        },
        navigate: async () => {
          alert("Navigate action triggered!");
        },
      }}
    >
      <ChatOuterContainer style={{ overflow: "hidden" }}>
        <ChatSidebarContainer>
          {/* Header */}
          <ChatSidebarHeader />

          {/* Messages Area */}
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

          {/* Error Display */}
          {error && <ChatMessageError>{error}</ChatMessageError>}

          {/* Input Area */}
          <ChatInputContainer>
            <ChatInput onSend={send} isLoading={isLoading} />
          </ChatInputContainer>
        </ChatSidebarContainer>

        {/* Right Panel - Output Tabs */}
        <Stack ax="stretch" fullwidth>
          <ChatSidebarActions
            clear={clear}
            messages={messages}
            copied={copied}
            handleShare={handleShare}
            tree={tree}
            code={jsxCode}
            jsonValue={jsonInput}
            onJsonChange={setJsonInput}
            parseError={parseError}
            onApply={handleParseJson}
          />
          {/* Rendered Content */}
          <RenderedContainer>
            {tree ? (
              <Renderer tree={tree} registry={registry} />
            ) : (
              <Text shade="muted">Generated UI will appear here</Text>
            )}
          </RenderedContainer>
        </Stack>
      </ChatOuterContainer>
    </JSONUIProvider>
  );
}
