"use client";

import { useState, useCallback, useEffect } from "react";

import type { BlockFile } from "./block-file";
import { useChatStore } from "./store";

export type SourceError = {
  source: string;
  error: string;
};

export type SourceMeta = {
  label: string;
  description?: string;
  author?: string;
};

export function useRegistryBlocks() {
  const [blocks, setBlocks] = useState<BlockFile[]>([]);
  const [sourceErrors, setSourceErrors] = useState<SourceError[]>([]);
  const [sources, setSources] = useState<SourceMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const setRegistryBlocks = useChatStore((s) => s.setRegistryBlocks);

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blocks");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data.blocks);
        setSourceErrors(data.errors ?? []);
        setSources(data.sources ?? []);
        setRegistryBlocks(data.blocks);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [setRegistryBlocks]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  return { blocks, sourceErrors, sources, isLoading, refetch: fetchBlocks };
}
