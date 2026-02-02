"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import {
  FolderOpenIcon,
  Trash2Icon,
  PencilIcon,
  CheckIcon,
  XIcon,
  CopyIcon,
  EyeIcon,
} from "@uiid/icons";
import { Badge } from "@uiid/indicators";
import { Input } from "@uiid/forms";
import { Group, Stack, Separator } from "@uiid/layout";
import { Sheet, useToastManager } from "@uiid/overlays";
import { Text } from "@uiid/typography";

import { useSavedBlocks } from "@/lib/use-saved-blocks";

import styles from "./saved-blocks-panel.module.css";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const SavedBlocksPanel = () => {
  const { latestBlocks, remove, rename, load } = useSavedBlocks();
  const toastManager = useToastManager();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [open, setOpen] = useState(false);

  const handleStartRename = (blockId: string, currentName: string) => {
    setEditingId(blockId);
    setEditName(currentName);
  };

  const handleConfirmRename = async () => {
    if (editingId && editName.trim()) {
      await rename(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
      toastManager.add({ description: `Renamed to "${editName.trim()}"` });
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleLoad = (block: (typeof latestBlocks)[number]) => {
    load(block);
    setOpen(false);
    toastManager.add({ description: `"${block.name}" loaded` });
  };

  const handleDelete = async (block: (typeof latestBlocks)[number]) => {
    await remove(block.blockId);
    toastManager.add({ description: `"${block.name}" deleted` });
  };

  const handleCopyLink = async (block: (typeof latestBlocks)[number]) => {
    try {
      const tree = JSON.parse(block.tree);
      const encoded = btoa(encodeURIComponent(JSON.stringify(tree)));
      const url = new URL(window.location.href);
      url.hash = encoded;
      url.search = "";
      await navigator.clipboard.writeText(url.toString());
      toastManager.add({ description: `Link copied for "${block.name}"` });
    } catch {
      toastManager.add({ description: "Failed to copy link" });
    }
  };

  return (
    <Sheet
      data-slot="saved-blocks-panel"
      title="Saved blocks"
      description="View and manage your saved blocks. They're stored in your browser's local storage."
      side="right"
      open={open}
      onOpenChange={setOpen}
      PopupProps={{ className: styles["popup"] }}
      trigger={
        <Button tooltip="View saved blocks" size="small" ghost>
          <FolderOpenIcon />
          View saved
        </Button>
      }
    >
      <Separator />
      <Stack gap={2} py={4} ax="stretch" fullwidth>
        {latestBlocks.length === 0 ? (
          <Stack ax="center" ay="center" p={8} gap={2}>
            <Text shade="muted" size={0}>
              No saved blocks yet
            </Text>
            <Text shade="muted" size={-1}>
              Use the Save button to save your first block.
            </Text>
          </Stack>
        ) : (
          latestBlocks.map((block) => (
            <Stack
              key={block.id}
              gap={3}
              ax="stretch"
              p={4}
              className={styles["block-card"]}
            >
              {editingId === block.blockId ? (
                <Group gap={1} ay="center">
                  <Input
                    size="small"
                    value={editName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditName(e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter") handleConfirmRename();
                      if (e.key === "Escape") handleCancelRename();
                    }}
                  />
                  <Button
                    size="xsmall"
                    square
                    ghost
                    tone="positive"
                    onClick={handleConfirmRename}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    size="xsmall"
                    square
                    ghost
                    onClick={handleCancelRename}
                  >
                    <XIcon />
                  </Button>
                </Group>
              ) : (
                <Group
                  ax="space-between"
                  ay="start"
                  fullwidth
                  gap={4}
                  onClick={() => handleLoad(block)}
                >
                  <Stack gap={4}>
                    <Text size={2} weight="bold">
                      {block.name}
                    </Text>
                    {block.description && (
                      <Text shade="muted">{block.description}</Text>
                    )}
                    <Text size={-1} shade="halftone">
                      {formatDate(block.updatedAt)}
                    </Text>
                  </Stack>

                  <Stack
                    gap={3}
                    ay="end"
                    ax="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge size="small">v{block.version}</Badge>
                    <Group gap={1}>
                      <Button
                        tooltip="View"
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
                        tooltip="Rename"
                        onClick={() =>
                          handleStartRename(block.blockId, block.name)
                        }
                        size="xsmall"
                        ghost
                        square
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        tooltip="Delete"
                        onClick={() => handleDelete(block)}
                        size="xsmall"
                        ghost
                        square
                      >
                        <Trash2Icon />
                      </Button>
                    </Group>
                  </Stack>
                </Group>
              )}
            </Stack>
          ))
        )}
      </Stack>
    </Sheet>
  );
};
SavedBlocksPanel.displayName = "SavedBlocksPanel";
