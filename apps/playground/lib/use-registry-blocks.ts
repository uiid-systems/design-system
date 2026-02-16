"use client";

import { useState, useCallback, useEffect } from "react";

import type { BlockFile } from "./block-file";
import { useChatStore } from "./store";

export function useRegistryBlocks() {
  const [blocks, setBlocks] = useState<BlockFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const setRegistryBlocks = useChatStore((s) => s.setRegistryBlocks);

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blocks");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data);
        setRegistryBlocks(data);
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

  return { blocks, isLoading, refetch: fetchBlocks };
}
