"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { UITree } from "@json-render/core";
import type { RxCollection } from "rxdb/plugins/core";

import { getDatabase, type SavedBlockDoc } from "./db";
import { useChatStore } from "./store";

function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useSavedBlocks() {
  const [blocks, setBlocks] = useState<SavedBlockDoc[]>([]);
  const [collection, setCollection] = useState<RxCollection<SavedBlockDoc> | null>(null);
  const setTree = useChatStore((s) => s.setTree);
  const activeBlockId = useChatStore((s) => s.activeBlockId);
  const setActiveBlock = useChatStore((s) => s.setActiveBlock);
  const clearActiveBlock = useChatStore((s) => s.clearActiveBlock);

  // Initialize database and subscribe to changes
  useEffect(() => {
    let sub: { unsubscribe: () => void } | null = null;
    let mounted = true;

    getDatabase().then((db) => {
      if (!mounted) return;
      const col = db["saved-blocks"];
      setCollection(col);

      sub = col
        .find({ sort: [{ createdAt: "desc" }] })
        .$.subscribe((docs) => {
          if (mounted) {
            setBlocks(docs.map((d) => d.toJSON()));
          }
        });
    });

    return () => {
      mounted = false;
      sub?.unsubscribe();
    };
  }, []);

  // Deduplicated list: latest version per blockId, plus version counts
  const { latestBlocks, versionCounts } = useMemo(() => {
    const map = new Map<string, SavedBlockDoc>();
    const counts = new Map<string, number>();
    for (const block of blocks) {
      counts.set(block.blockId, (counts.get(block.blockId) ?? 0) + 1);
      const existing = map.get(block.blockId);
      if (!existing || block.version > existing.version) {
        map.set(block.blockId, block);
      }
    }
    const sorted = Array.from(map.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    return { latestBlocks: sorted, versionCounts: counts };
  }, [blocks]);

  const getVersionsForBlock = useCallback(
    (blockId: string): SavedBlockDoc[] => {
      return blocks
        .filter((b) => b.blockId === blockId)
        .sort((a, b) => b.version - a.version);
    },
    [blocks]
  );

  const save = useCallback(
    async (name: string, description: string, tree: UITree) => {
      if (!collection || !name.trim()) return;
      const now = Date.now();

      if (activeBlockId) {
        // Save as new version of existing block
        const versions = blocks.filter((b) => b.blockId === activeBlockId);
        const maxVersion = versions.reduce((max, b) => Math.max(max, b.version), 0);
        const newId = generateId();
        await collection.insert({
          id: newId,
          blockId: activeBlockId,
          name: name.trim(),
          description: description.trim(),
          version: maxVersion + 1,
          tree: JSON.stringify(tree),
          createdAt: now,
          updatedAt: now,
        });
        setActiveBlock(activeBlockId, newId);
      } else {
        // Create new block
        const newBlockId = generateId();
        const newId = newBlockId;
        await collection.insert({
          id: newId,
          blockId: newBlockId,
          name: name.trim(),
          description: description.trim(),
          version: 1,
          tree: JSON.stringify(tree),
          createdAt: now,
          updatedAt: now,
        });
        setActiveBlock(newBlockId, newId);
      }
    },
    [collection, activeBlockId, blocks, setActiveBlock]
  );

  const saveAsNew = useCallback(
    async (name: string, description: string, tree: UITree) => {
      if (!collection || !name.trim()) return;
      const now = Date.now();
      const newBlockId = generateId();
      const newId = newBlockId;
      await collection.insert({
        id: newId,
        blockId: newBlockId,
        name: name.trim(),
        description: description.trim(),
        version: 1,
        tree: JSON.stringify(tree),
        createdAt: now,
        updatedAt: now,
      });
      setActiveBlock(newBlockId, newId);
    },
    [collection, setActiveBlock]
  );

  const remove = useCallback(
    async (blockId: string) => {
      if (!collection) return;
      // Find matching version IDs from in-memory state and remove by primary key
      const idsToRemove = blocks
        .filter((b) => b.blockId === blockId)
        .map((b) => b.id);
      for (const id of idsToRemove) {
        const doc = await collection.findOne(id).exec();
        if (doc) await doc.remove();
      }
      if (activeBlockId === blockId) {
        clearActiveBlock();
      }
    },
    [collection, blocks, activeBlockId, clearActiveBlock]
  );

  const rename = useCallback(
    async (blockId: string, newName: string) => {
      if (!collection || !newName.trim()) return;
      // Find matching version IDs from in-memory state and rename by primary key
      const idsToRename = blocks
        .filter((b) => b.blockId === blockId)
        .map((b) => b.id);
      for (const id of idsToRename) {
        const doc = await collection.findOne(id).exec();
        if (doc) await doc.patch({ name: newName.trim(), updatedAt: Date.now() });
      }
    },
    [collection, blocks]
  );

  const load = useCallback(
    (block: SavedBlockDoc) => {
      try {
        const tree = JSON.parse(block.tree) as UITree;
        setTree(tree);
        setActiveBlock(block.blockId, block.id);
      } catch {
        console.error("Failed to parse saved block:", block.id);
      }
    },
    [setTree, setActiveBlock]
  );

  return { blocks, latestBlocks, versionCounts, save, saveAsNew, remove, rename, load, getVersionsForBlock };
}
