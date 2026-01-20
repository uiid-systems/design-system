"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { CodeBlock, CodeEditor } from "@uiid/code";
import { Textarea } from "@uiid/forms";
import { Tabs } from "@uiid/interactive";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { registry } from "@/lib/components";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";
import { useChat, type ChatMessage } from "@/lib/use-chat";

/**
 * Chat message bubble component.
 */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

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
          {message.content || "Thinking..."}
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
  const { messages, tree, isLoading, error, send, clear, setTree } = useChat();

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
        style={{ height: "100vh", overflow: "hidden" }}
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
            {messages.length > 0 && (
              <Button variant="subtle" size="small" onClick={clear}>
                Clear
              </Button>
            )}
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
        <Stack gap={0} style={{ flex: 1, height: "100%", overflow: "hidden" }}>
          {/* Header */}
          <Group
            p={4}
            ax="space-between"
            ay="center"
            style={{ borderBottom: "1px solid var(--globals-border-color)" }}
          >
            <Text size={3} weight="bold">
              Output
            </Text>
            <Group gap={2}>
              {Object.keys(registry)
                .slice(0, 8)
                .map((name) => (
                  <Text
                    key={name}
                    size={-1}
                    shade="muted"
                    style={{
                      padding: "2px 6px",
                      backgroundColor: "var(--shade-surface)",
                      borderRadius: 4,
                    }}
                  >
                    {name}
                  </Text>
                ))}
              <Text size={-1} shade="muted">
                +{Object.keys(registry).length - 8} more
              </Text>
            </Group>
          </Group>

          {/* Tabs Content */}
          <Stack p={4} style={{ flex: 1, overflow: "hidden" }}>
            <Tabs
              items={[
                {
                  label: "Preview",
                  value: "preview",
                  render: (
                    <Stack
                      p={4}
                      style={{
                        backgroundColor: "var(--shade-background)",
                        borderRadius: 8,
                        minHeight: 300,
                        overflow: "auto",
                      }}
                    >
                      {tree ? (
                        <Renderer tree={tree} registry={registry} />
                      ) : (
                        <Stack ax="center" ay="center" style={{ flex: 1 }}>
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
                      <Button onClick={handleParseJson} variant="subtle">
                        Apply Changes
                      </Button>
                    </Stack>
                  ),
                },
                {
                  label: "JSX",
                  value: "jsx",
                  render: (
                    <Stack fullwidth>
                      {jsxCode ? (
                        <div
                          style={{
                            maxHeight: "500px",
                            overflow: "auto",
                            width: "100%",
                          }}
                        >
                          <CodeBlock
                            code={jsxCode}
                            language="tsx"
                            filename="component.tsx"
                            showLineNumbers
                          />
                        </div>
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
