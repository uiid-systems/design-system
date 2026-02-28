"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { UISpec } from "@/lib/catalog";
import { useChatStore } from "@/lib/store";
import { treeToFormattedJsx } from "@/lib/tree-to-jsx";

const DEBOUNCE_MS = 500;

export function useCodeView() {
  const tree = useChatStore((s) => s.tree);
  const setTree = useChatStore((s) => s.setTree);

  const [jsonInput, setJsonInput] = useState("");
  const [jsxCode, setJsxCode] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  const isEditingRef = useRef(false);
  const lastTreeRef = useRef<UISpec | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const treeJson = useMemo(() => {
    return tree ? JSON.stringify(tree, null, 2) : "";
  }, [tree]);

  // Sync store tree -> local jsonInput (skip if user is actively editing)
  useEffect(() => {
    if (isEditingRef.current) return;

    if (tree && tree !== lastTreeRef.current) {
      lastTreeRef.current = tree;
      queueMicrotask(() => {
        setJsonInput(treeJson);
        setParseError(null);
      });
    } else if (!tree && lastTreeRef.current) {
      lastTreeRef.current = null;
      queueMicrotask(() => {
        setJsonInput("");
        setParseError(null);
      });
    }
  }, [tree, treeJson]);

  // Sync store tree -> JSX code
  useEffect(() => {
    if (tree) {
      treeToFormattedJsx(tree).then((jsx) => {
        queueMicrotask(() => setJsxCode(jsx));
      });
    } else {
      queueMicrotask(() => setJsxCode(""));
    }
  }, [tree]);

  // Debounced parse: apply JSON edits to store after delay
  const applyJson = useCallback(
    (value: string) => {
      try {
        const parsed = JSON.parse(value);
        setParseError(null);
        lastTreeRef.current = parsed;
        setTree(parsed);
      } catch (error) {
        setParseError(
          error instanceof Error ? error.message : "Invalid JSON"
        );
      } finally {
        isEditingRef.current = false;
      }
    },
    [setTree]
  );

  const handleJsonChange = useCallback(
    (value: string) => {
      isEditingRef.current = true;
      setJsonInput(value);
      setParseError(null);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => applyJson(value), DEBOUNCE_MS);
    },
    [applyJson]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    jsonInput,
    jsxCode,
    parseError,
    handleJsonChange,
  };
}
