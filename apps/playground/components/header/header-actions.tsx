"use client";

import type { UITree } from "@json-render/core";
import { useState, useEffect, useRef, useMemo } from "react";

import { Button } from "@uiid/buttons";
import { CopyIcon, SquareCheckIcon } from "@uiid/icons";
import { Group, Separator } from "@uiid/layout";

import { useChatStore } from "@/lib/store";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";

import { NewChatButton } from "../new-chat-button";
import { SaveButton } from "../save-button";
import { SavedBlocksPanel } from "../saved-blocks-panel";
import { RenderedSheet } from "../rendered-sheet";

export const HeaderActions = () => {
  const tree = useChatStore((s) => s.tree);
  const setTree = useChatStore((s) => s.setTree);
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
    <>
      <Group data-slot="header-actions" gap={1} p={2}>
        <RenderedSheet
          code={jsxCode}
          jsonValue={jsonInput}
          onJsonChange={setJsonInput}
          parseError={parseError}
          onApply={handleParseJson}
          triggerText="View code"
        />

        <Button
          data-slot="header-actions-copy"
          tooltip="Copy link to block"
          onClick={handleShare}
          disabled={!tree || copied}
          size="small"
          ghost
          square
        >
          {copied ? <SquareCheckIcon /> : <CopyIcon />}
        </Button>
        <SaveButton />
      </Group>
      <Group gap={2} style={{ marginLeft: "auto" }}>
        <NewChatButton />
        <Separator orientation="vertical" />
        <SavedBlocksPanel />
      </Group>
    </>
  );
};
HeaderActions.displayName = "HeaderActions";
