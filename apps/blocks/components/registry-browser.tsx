"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

import { Button } from "@uiid/buttons";
import { Input } from "@uiid/forms";
import { Badge } from "@uiid/indicators";
import { PackageIcon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Modal, useToastManager } from "@uiid/overlays";
import { Text } from "@uiid/typography";

import { countComponents } from "@uiid/registry";

import type { BlockFile } from "@/lib/block-file";
import { useChatStore } from "@/lib/store";
import { useRegistryBlocks } from "@/lib/use-registry-blocks";

import { BlockThumbnail } from "./block-thumbnail";

import styles from "./registry-browser.module.css";

export const RegistryBrowser = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { blocks, isLoading, refetch } = useRegistryBlocks();
  const setTree = useChatStore((s) => s.setTree);
  const setActiveRegistryBlock = useChatStore((s) => s.setActiveRegistryBlock);
  const toastManager = useToastManager();

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return blocks;
    const q = search.toLowerCase();
    return blocks.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [blocks, search]);

  const handleLoad = useCallback(
    (block: BlockFile) => {
      setTree(block.tree);
      setActiveRegistryBlock(block);
      setOpen(false);
      setSearch("");
      toastManager.add({ description: `"${block.name}" loaded from registry` });
    },
    [setTree, setActiveRegistryBlock, toastManager]
  );

  return (
    <Modal
      data-slot="registry-browser"
      open={open}
      onOpenChange={setOpen}
      size="xlarge"
      trigger={
        <Button tooltip="Browse block registry (⌘K)" size="small" variant="ghost">
          <PackageIcon />
          Registry
        </Button>
      }
      PopupProps={{ className: styles.modal }}
    >
      <Stack gap={4} ax="stretch" fullwidth fullheight>
        <Input
          placeholder="Search blocks..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          autoFocus
        />

        <div className={styles.grid} style={{ flex: 1, overflowY: "auto" }}>
          {isLoading ? (
            <Stack ax="center" ay="center" p={8}>
              <Text shade="muted">Loading blocks...</Text>
            </Stack>
          ) : filtered.length === 0 ? (
            <Stack ax="center" ay="center" p={8}>
              <Text shade="muted">
                {search ? "No blocks match your search." : "No blocks in registry."}
              </Text>
            </Stack>
          ) : (
            filtered.map((block) => {
              const cc = safeCount(block);
              return (
                <button
                  key={block.slug}
                  className={styles.card}
                  onClick={() => handleLoad(block)}
                  type="button"
                >
                  <BlockThumbnail spec={block.tree} />
                  <Stack gap={2} p={3} ax="stretch">
                    <Text size={1} weight="bold">
                      {block.name}
                    </Text>
                    {block.description && (
                      <Text size={-1} shade="muted" style={{ lineClamp: 2 }}>
                        {block.description}
                      </Text>
                    )}
                    <Group gap={2} ay="center" style={{ flexWrap: "wrap" }}>
                      {cc && (
                        <Text size={-1} shade="muted">
                          {cc.total}{" "}
                          {cc.total === 1 ? "component" : "components"}
                        </Text>
                      )}
                      {block.tags.map((tag) => (
                        <Badge key={tag} size="small">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </button>
              );
            })
          )}
        </div>
      </Stack>
    </Modal>
  );
};
RegistryBrowser.displayName = "RegistryBrowser";

function safeCount(block: BlockFile) {
  try {
    return countComponents(block.tree);
  } catch {
    return null;
  }
}
