"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { CodeBlock, CodeEditor } from "@uiid/code";
import { Textarea } from "@uiid/forms";
import { CircleXIcon, ShareIcon, CircleCheckIcon } from "@uiid/icons";
import { Tabs } from "@uiid/interactive";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { registry } from "@/lib/components";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";
import { useChat, type ChatMessage } from "@/lib/use-chat";

/**
 * Strip JSON code blocks from message content for cleaner chat display.
 * The code is already shown in the output tabs.
 */
function stripCodeBlocks(content: string): string {
  // Remove ```json ... ``` blocks
  return content.replace(/```(?:json)?\s*[\s\S]*?```/g, "").trim();
}

/**
 * Chat message bubble component.
 */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  // For assistant messages, strip out code blocks to keep it conversational
  const displayContent = isUser
    ? message.content
    : stripCodeBlocks(message.content) || "Thinking...";

  return (
    <Stack
      gap={2}
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "85%",
      }}
    >
      <Text size={-1} shade="muted">
        {isUser ? "You" : "Assistant"}
      </Text>
      <Card ghost={isUser}>
        <Text style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {displayContent}
        </Text>
      </Card>
    </Stack>
  );
}

/**
 * Chat input component with textarea and send button.
 */
function ChatInput({
  onSend,
  isLoading,
}: {
  onSend: (prompt: string) => void;
  isLoading: boolean;
}) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Stack gap={2} fullwidth ax="stretch">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the UI you want to create..."
        rows={8}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Group gap={2} ax="end">
        <Button onClick={handleSubmit} disabled={!input.trim() || isLoading}>
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </Group>
    </Stack>
  );
}

/**
 * Main playground page with chat interface and output tabs.
 */
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
      <Group
        gap={0}
        fullwidth
        style={{ height: "100dvh", overflow: "hidden" }}
        ay="stretch"
      >
        {/* Left Panel - Chat */}
        <Stack
          gap={0}
          ax="stretch"
          style={{
            width: "400px",
            minWidth: "400px",
            borderRight: "1px solid var(--globals-border-color)",
            height: "100%",
          }}
        >
          {/* Chat Header */}
          <Group
            gap={4}
            ax="space-between"
            ay="center"
            p={4}
            style={{ borderBottom: "1px solid var(--globals-border-color)" }}
          >
            <Stack gap={2}>
              <Text size={3} weight="bold">
                uiid + json-render
              </Text>
              <Text size={-1} shade="muted">
                Describe what you want to build
              </Text>
            </Stack>
            <Group gap={2}>
              <Button
                variant="subtle"
                size="small"
                onClick={clear}
                disabled={messages.length === 0}
                tooltip="Clear the UI you've created"
                square
              >
                <CircleXIcon />
              </Button>
              <Button
                size="small"
                variant="subtle"
                tooltip="You can copy the URL to share what you've built!"
                tone={copied ? "positive" : undefined}
                square
                onClick={handleShare}
                disabled={!tree || copied}
              >
                {copied ? <CircleCheckIcon /> : <ShareIcon />}
              </Button>
            </Group>
          </Group>

          {/* Messages Area */}
          <Stack
            gap={3}
            p={4}
            style={{
              flex: 1,
              overflowY: "auto",
              alignItems: "stretch",
            }}
          >
            {messages.length === 0 ? (
              <Stack gap={4} ay="center" style={{ flex: 1 }}>
                <Text family="mono" size={-1} shade="muted">
                  {'"Create a login form with email and password"'}
                </Text>
                <Text family="mono" size={-1} shade="muted">
                  {'"Build a pricing card with three tiers"'}
                </Text>
                <Text family="mono" size={-1} shade="muted">
                  {'"Make a settings panel with toggles"'}
                </Text>
              </Stack>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </Stack>

          {/* Error Display */}
          {error && (
            <Stack p={4} pt={0}>
              <Card tone="negative" ghost>
                <Text tone="negative">{error}</Text>
              </Card>
            </Stack>
          )}

          {/* Input Area */}
          <Stack
            p={4}
            style={{ borderTop: "1px solid var(--globals-border-color)" }}
          >
            <ChatInput onSend={send} isLoading={isLoading} />
          </Stack>
        </Stack>

        {/* Right Panel - Output Tabs */}
        <Stack ax="stretch" fullwidth>
          {/* Tabs Content */}
          <Stack data-slot="rendered-content" p={4} fullwidth fullheight>
            <Tabs
              RootProps={{ style: { height: "100%", width: "100%" } }}
              ContainerProps={{
                style: { height: "100%", paddingBlock: "1rem" },
              }}
              items={[
                {
                  label: "Preview",
                  value: "preview",
                  render: (
                    <Stack p={4}>
                      {tree ? (
                        <Renderer tree={tree} registry={registry} />
                      ) : (
                        <Stack ax="center" ay="center">
                          <Text shade="muted" style={{ textAlign: "center" }}>
                            Generated UI will appear here
                          </Text>
                        </Stack>
                      )}
                    </Stack>
                  ),
                },
                {
                  label: "JSON",
                  value: "json",
                  render: (
                    <Stack gap={3} fullwidth>
                      <CodeEditor
                        value={jsonInput}
                        onValueChange={setJsonInput}
                        language="json"
                        filename="ui-tree.json"
                        rows={20}
                      />
                      {parseError && (
                        <Text tone="negative">Parse Error: {parseError}</Text>
                      )}
                      <Button onClick={handleParseJson} fullwidth>
                        Apply Changes
                      </Button>
                    </Stack>
                  ),
                },
                {
                  label: "JSX",
                  value: "jsx",
                  render: (
                    <Stack fullwidth fullheight>
                      {jsxCode ? (
                        <CodeBlock
                          code={jsxCode}
                          language="tsx"
                          filename="component.tsx"
                          showLineNumbers
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <Stack ax="center" ay="center" style={{ flex: 1 }}>
                          <Text shade="muted" style={{ textAlign: "center" }}>
                            JSX output will appear here
                          </Text>
                        </Stack>
                      )}
                    </Stack>
                  ),
                },
              ]}
              keepMounted
            />
          </Stack>
        </Stack>
      </Group>
    </JSONUIProvider>
  );
}
