"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import {
  FolderOpenIcon,
  Trash2Icon,
  PencilIcon,
  CheckIcon,
  XIcon,
} from "@uiid/icons";
import { Input } from "@uiid/forms";
import { Group, Stack } from "@uiid/layout";
import { Sheet } from "@uiid/overlays";
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
  const { blocks, remove, rename, load } = useSavedBlocks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [open, setOpen] = useState(false);

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleConfirmRename = async () => {
    if (editingId && editName.trim()) {
      await rename(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleLoad = (block: (typeof blocks)[number]) => {
    load(block);
    setOpen(false);
  };

  return (
    <Sheet
      data-slot="saved-blocks-panel"
      title="Saved blocks"
      side="right"
      open={open}
      onOpenChange={setOpen}
      PopupProps={{ className: styles["popup"] }}
      trigger={
        <Button tooltip="Saved blocks" size="small" square ghost>
          <FolderOpenIcon />
        </Button>
      }
    >
      <Stack gap={2} py={4} ax="stretch" fullwidth>
        {blocks.length === 0 ? (
          <Stack ax="center" ay="center" p={8} gap={2}>
            <Text shade="muted" size={0}>
              No saved blocks yet
            </Text>
            <Text shade="muted" size={-1}>
              Use the Save button to save your first block.
            </Text>
          </Stack>
        ) : (
          blocks.map((block) => (
            <Stack key={block.id} gap={1} p={3} ax="stretch">
              {editingId === block.id ? (
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
                <Group ax="space-between" ay="center" fullwidth>
                  <Stack
                    gap={0}
                    className={styles["block-row"]}
                    onClick={() => handleLoad(block)}
                  >
                    <Text size={0} weight="bold">
                      {block.name}
                    </Text>
                    <Text size={-1} shade="muted">
                      {formatDate(block.createdAt)}
                    </Text>
                  </Stack>
                  <Group gap={0}>
                    <Button
                      size="xsmall"
                      square
                      ghost
                      tooltip="Rename"
                      onClick={() => handleStartRename(block.id, block.name)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      size="xsmall"
                      square
                      ghost
                      tone="critical"
                      tooltip="Delete"
                      onClick={() => remove(block.id)}
                    >
                      <Trash2Icon />
                    </Button>
                  </Group>
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
