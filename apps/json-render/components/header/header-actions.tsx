"use client";

import type { UITree } from "@json-render/core";
import { useState, useEffect, useRef, useMemo } from "react";

import { Button } from "@uiid/buttons";
import { RefreshCwIcon, CopyIcon, SquareCheckIcon } from "@uiid/icons";
import { Group } from "@uiid/layout";

import { useChatStore } from "@/lib/store";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";

import { RenderedSheet } from "../rendered-sheet";

export const HeaderActions = () => {
  const messages = useChatStore((s) => s.messages);
  const tree = useChatStore((s) => s.tree);
  const setTree = useChatStore((s) => s.setTree);
  const clear = useChatStore((s) => s.clear);
  const getShareUrl = useChatStore((s) => s.getShareUrl);

  const lastTreeRef = useRef<UITree | null>(null);

  const [copied, setCopied] = useState(false);
  const [jsxCode, setJsxCode] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  // Derive JSON from tree
  const treeJson = useMemo(() => {
    return tree ? JSON.stringify(tree, null, 2) : "";
  }, [tree]);

  // Sync JSON input when tree changes from AI (not from manual edits)
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

  const handleShare = async () => {
    const url = getShareUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleParseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput) as UITree;
      setTree(parsed);
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

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

  return (
    <Group data-slot="header-actions" gap={2} p={2} ax="end">
      <Button
        data-slot="header-actions-clear"
        size="small"
        onClick={clear}
        disabled={messages.length === 0 && !tree}
        tooltip="Clear the UI you've created"
      >
        <RefreshCwIcon />
      </Button>
      <Button
        data-slot="header-actions-share"
        tooltip="Copy Url"
        size="small"
        onClick={handleShare}
        disabled={!tree || copied}
        square
      >
        {copied ? <SquareCheckIcon /> : <CopyIcon />}
        {/* {copied ? "Link copied!" : "Copy link"} */}
      </Button>
      <RenderedSheet
        code={jsxCode}
        jsonValue={jsonInput}
        onJsonChange={setJsonInput}
        parseError={parseError}
        onApply={handleParseJson}
      />
    </Group>
  );
};
HeaderActions.displayName = "HeaderActions";
