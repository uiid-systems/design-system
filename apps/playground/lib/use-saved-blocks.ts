"use client";

import { useEffect, useState, useCallback } from "react";
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

  const save = useCallback(
    async (name: string, tree: UITree) => {
      if (!collection || !name.trim()) return;
      const now = Date.now();
      await collection.insert({
        id: generateId(),
        name: name.trim(),
        tree: JSON.stringify(tree),
        createdAt: now,
        updatedAt: now,
      });
    },
    [collection]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!collection) return;
      const doc = await collection.findOne(id).exec();
      if (doc) await doc.remove();
    },
    [collection]
  );

  const rename = useCallback(
    async (id: string, newName: string) => {
      if (!collection || !newName.trim()) return;
      const doc = await collection.findOne(id).exec();
      if (doc) {
        await doc.patch({ name: newName.trim(), updatedAt: Date.now() });
      }
    },
    [collection]
  );

  const load = useCallback(
    (block: SavedBlockDoc) => {
      try {
        const tree = JSON.parse(block.tree) as UITree;
        setTree(tree);
      } catch {
        console.error("Failed to parse saved block:", block.id);
      }
    },
    [setTree]
  );

  return { blocks, save, remove, rename, load };
}
