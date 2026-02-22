"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import type { UISpec } from "@/lib/catalog";

import { Button } from "@uiid/buttons";
import { XIcon } from "@uiid/icons";
import { Tabs } from "@uiid/interactive";
import { useSidebar } from "@uiid/navigation";

import { useChatStore } from "@/lib/store";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";

import { RenderedJson } from "./rendered-json";
import { RenderedJsx } from "./rendered-jsx";

import styles from "./code-panel.module.css";

export const CodePanel = () => {
  const tree = useChatStore((s) => s.tree);
  const setTree = useChatStore((s) => s.setTree);
  const { open, toggleSidebar } = useSidebar();

  const lastTreeRef = useRef<UISpec | null>(null);

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

  useEffect(() => {
    if (tree) {
      treeToFormattedJsx(tree).then((jsx) => {
        queueMicrotask(() => setJsxCode(jsx));
      });
    } else {
      queueMicrotask(() => setJsxCode(""));
    }
  }, [tree]);

  const handleParseJson = () => {
    try {
      setTree(JSON.parse(jsonInput));
      setParseError(null);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  if (!open) return null;

  return (
    <div className={styles.panel}>
      <Button
        tooltip="Close code panel"
        onClick={toggleSidebar}
        size="xsmall"
        variant="ghost"
        shape="square"
        className={styles.closeButton}
      >
        <XIcon />
      </Button>
      <Tabs
        evenly
        keepMounted
        RootProps={{ fullwidth: true, fullheight: true, ax: "stretch" }}
        ContainerProps={{ style: { flex: 1, overflow: "auto" } }}
        items={[
          {
            label: "JSON",
            value: "json",
            render: (
              <RenderedJson
                value={jsonInput}
                onValueChange={setJsonInput}
                parseError={parseError}
                onApply={handleParseJson}
              />
            ),
          },
          {
            label: "JSX",
            value: "jsx",
            render: <RenderedJsx code={jsxCode} style={{ width: "100%" }} />,
          },
        ]}
      />
    </div>
  );
};
CodePanel.displayName = "CodePanel";
