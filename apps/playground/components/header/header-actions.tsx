"use client";

import type { UISpec } from "@/lib/catalog";
import { useState, useEffect, useRef, useMemo } from "react";

import { Button } from "@uiid/buttons";
import { ScanSearchIcon, CopyIcon, SquareCheckIcon } from "@uiid/icons";
import { Group, Separator } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";

import { RegistryBrowser } from "../registry-browser";
import { RenderedSheet } from "../rendered-sheet";
import { StatsSheet } from "../stats-sheet";

export const HeaderActions = () => {
  const tree = useChatStore((s) => s.tree);
  const setTree = useChatStore((s) => s.setTree);
  const getShareUrl = useChatStore((s) => s.getShareUrl);
  const inspecting = useChatStore((s) => s.inspecting);
  const toggleInspecting = useChatStore((s) => s.toggleInspecting);

  const lastTreeRef = useRef<UISpec | null>(null);

  const [copied, setCopied] = useState(false);
  const [jsxCode, setJsxCode] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

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

  const handleParseJson = () => {
    try {
      setTree(JSON.parse(jsonInput));
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  const handleShare = async () => {
    const url = getShareUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (tree) {
      treeToFormattedJsx(tree).then((jsx) => {
        queueMicrotask(() => setJsxCode(jsx));
      });
    } else {
      queueMicrotask(() => setJsxCode(""));
    }
  }, [tree]);

  return (
    <Group data-slot="header-actions" gap={2} ay="center">
      {/* Block tools — only visible when a block is loaded */}
      {tree && (
        <>
          <Group gap={1}>
            <RenderedSheet
              code={jsxCode}
              jsonValue={jsonInput}
              onJsonChange={setJsonInput}
              parseError={parseError}
              onApply={handleParseJson}
              triggerText="View code"
            />
            <StatsSheet />
            <Button
              tooltip="Inspect elements — hover to see component info"
              onClick={toggleInspecting}
              size="small"
              ghost
              tone={inspecting ? "info" : undefined}
            >
              <ScanSearchIcon />
              Inspect
            </Button>
          </Group>

          <Separator orientation="vertical" />

          <Group gap={1}>
            <Button
              tooltip={copied ? "Copied!" : "Copy shareable link"}
              onClick={handleShare}
              disabled={copied}
              size="small"
              ghost
            >
              {copied ? <SquareCheckIcon /> : <CopyIcon />}
              <Text size={-1}>{copied ? "Copied" : "Share"}</Text>
            </Button>
          </Group>

          <Separator orientation="vertical" />
        </>
      )}

      {/* Navigation — always visible */}
      <Group gap={1}>
        <RegistryBrowser />
      </Group>
    </Group>
  );
};
HeaderActions.displayName = "HeaderActions";
