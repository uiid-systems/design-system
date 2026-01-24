"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";

import { Stack, Group } from "@uiid/layout";
import { Button } from "@uiid/buttons";
import { Text } from "@uiid/typography";

import { registry as componentRegistry } from "@/lib/components";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";
import { useChat } from "@/lib/use-chat";
import { getComponentPreviews } from "@/lib/preview-loader";

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

export default function ComponentPage() {
  const params = useParams<{ name: string }>();
  const componentName = params.name;

  const previews = getComponentPreviews(componentName);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const initialTree = previews?.[selectedIndex]?.tree ?? undefined;

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
  } = useChat({
    initialTree,
    storageKey: `json-render-component-${componentName}`,
  });
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = getShareUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [jsxCode, setJsxCode] = useState("");
  const lastTreeRef = useRef<UITree | null>(null);

  const treeJson = useMemo(() => {
    return tree ? JSON.stringify(tree, null, 2) : "";
  }, [tree]);

  useEffect(() => {
    if (tree && tree !== lastTreeRef.current) {
      lastTreeRef.current = tree;
      queueMicrotask(() => setJsonInput(treeJson));
    } else if (!tree && lastTreeRef.current) {
      lastTreeRef.current = null;
      queueMicrotask(() => {
        setJsonInput("");
        setParseError(null);
      });
    }
  }, [tree, treeJson]);

  useEffect(() => {
    if (tree) {
      treeToFormattedJsx(tree).then((jsx) => {
        queueMicrotask(() => setJsxCode(jsx));
      });
    } else {
      queueMicrotask(() => setJsxCode(""));
    }
  }, [tree]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleParseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput) as UITree;
      setTree(parsed);
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const handleLoadPreview = (index: number) => {
    if (!previews) return;
    setSelectedIndex(index);
    setTree(previews[index].tree);
  };

  if (!previews) {
    return (
      <Stack gap={4} p={8} ax="center" ay="center" fullwidth fullheight>
        <Text size={3} weight="bold">
          No previews available
        </Text>
        <Text shade="muted">
          Component &ldquo;{componentName}&rdquo; does not have preview trees defined in the registry.
        </Text>
      </Stack>
    );
  }

  return (
    <JSONUIProvider
      registry={componentRegistry}
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
          <Stack gap={2} px={4} py={4} bb={1}>
            <Text size={2} weight="bold">
              {componentName}
            </Text>
            {previews.length > 1 && (
              <Group gap={2} style={{ flexWrap: "wrap" }}>
                {previews.map((p, i) => (
                  <Button
                    key={p.label}
                    size="small"
                    variant={i === selectedIndex ? undefined : "subtle"}
                    onClick={() => handleLoadPreview(i)}
                  >
                    {p.label}
                  </Button>
                ))}
              </Group>
            )}
          </Stack>

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

        {/* Right Panel - Output */}
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
          <RenderedContainer>
            {tree ? (
              <Renderer tree={tree} registry={componentRegistry} />
            ) : (
              <Text shade="muted">Generated UI will appear here</Text>
            )}
          </RenderedContainer>
        </Stack>
      </ChatOuterContainer>
    </JSONUIProvider>
  );
}
