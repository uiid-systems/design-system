"use client";

import { useState, useCallback, useEffect } from "react";

import { Button } from "@uiid/buttons";
import { PackageIcon, EyeIcon, CopyIcon, Trash2Icon } from "@uiid/icons";
import { Group, Stack, Separator } from "@uiid/layout";
import { Sheet, useToastManager } from "@uiid/overlays";
import { Text } from "@uiid/typography";

import { countComponents } from "@uiid/registry";

import type { BlockFile } from "@/lib/block-file";
import { useChatStore } from "@/lib/store";

import styles from "./saved-blocks-panel.module.css";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const RegistryPanel = () => {
  const setTree = useChatStore((s) => s.setTree);
  const setActiveRegistryBlock = useChatStore((s) => s.setActiveRegistryBlock);
  const toastManager = useToastManager();
  const [open, setOpen] = useState(false);
  const [blocks, setBlocks] = useState<BlockFile[]>([]);

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await fetch("/api/blocks");
      if (res.ok) setBlocks(await res.json());
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    if (open) fetchBlocks();
  }, [open, fetchBlocks]);

  const handleLoad = (block: BlockFile) => {
    setTree(block.tree);
    setActiveRegistryBlock(block);
    setOpen(false);
    toastManager.add({ description: `"${block.name}" loaded from registry` });
  };

  const handleCopyLink = async (block: BlockFile) => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(block.tree)));
      const url = new URL(window.location.href);
      url.hash = encoded;
      url.search = "";
      await navigator.clipboard.writeText(url.toString());
      toastManager.add({ description: `Link copied for "${block.name}"` });
    } catch {
      toastManager.add({ description: "Failed to copy link" });
    }
  };

  const handleDelete = async (block: BlockFile) => {
    try {
      const res = await fetch(`/api/blocks/${block.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toastManager.add({
        description: `"${block.name}" removed from registry`,
      });
      fetchBlocks();
    } catch {
      toastManager.add({ description: "Failed to delete block" });
    }
  };

  const getComponentCount = (block: BlockFile) => {
    try {
      return countComponents(block.tree);
    } catch {
      return null;
    }
  };

  return (
    <Sheet
      data-slot="registry-panel"
      title="Block registry"
      description="Blocks exported to the blocks/ directory. These are version-controlled and shareable."
      side="right"
      open={open}
      onOpenChange={setOpen}
      PopupProps={{ className: styles["popup"] }}
      trigger={
        <Button tooltip="Block registry" size="small" ghost square>
          <PackageIcon />
        </Button>
      }
    >
      <Separator mt={4} />
      <Stack gap={12} py={4} ax="stretch" fullwidth>
        {blocks.length === 0 ? (
          <Stack ax="center" ay="center" p={8} gap={2}>
            <Text shade="muted" size={0}>
              No blocks in registry
            </Text>
            <Text shade="muted" size={-1}>
              Export a saved block to add it to the registry.
            </Text>
          </Stack>
        ) : (
          blocks.map((block) => {
            const cc = getComponentCount(block);
            return (
              <Stack
                key={block.slug}
                gap={8}
                ax="stretch"
                className={styles["block-card"]}
              >
                <Group ax="space-between" ay="start" fullwidth gap={8}>
                  <Stack gap={4}>
                    <Text size={2} weight="bold">
                      {block.name}
                    </Text>
                    {block.description && (
                      <Text shade="muted">{block.description}</Text>
                    )}
                    <Group gap={2} ay="center">
                      <Text size={-1} weight="bold">
                        Last saved {formatDate(block.updatedAt)}
                      </Text>
                      &middot;
                      <Text size={-1} weight="bold">
                        {block.version}{" "}
                        {block.version === 1 ? "version" : "versions"}
                      </Text>
                      {cc && (
                        <>
                          &middot;
                          <Text size={-1} weight="bold">
                            {cc.total}{" "}
                            {cc.total === 1 ? "component" : "components"}
                          </Text>
                        </>
                      )}
                      {block.tags.length > 0 && (
                        <>
                          &middot;
                          <Text size={-1} shade="muted">
                            {block.tags.join(", ")}
                          </Text>
                        </>
                      )}
                    </Group>
                  </Stack>

                  <Group gap={1}>
                    <Button
                      tooltip="Load into playground"
                      onClick={() => handleLoad(block)}
                      size="xsmall"
                      ghost
                      square
                    >
                      <EyeIcon />
                    </Button>
                    <Button
                      tooltip="Copy link"
                      onClick={() => handleCopyLink(block)}
                      size="xsmall"
                      ghost
                      square
                    >
                      <CopyIcon />
                    </Button>
                    <Button
                      tooltip="Delete from registry"
                      onClick={() => handleDelete(block)}
                      size="xsmall"
                      ghost
                      square
                    >
                      <Trash2Icon />
                    </Button>
                  </Group>
                </Group>
              </Stack>
            );
          })
        )}
      </Stack>
    </Sheet>
  );
};
RegistryPanel.displayName = "RegistryPanel";
