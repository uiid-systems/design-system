"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import { Input } from "@uiid/forms";
import {
  FolderOpenIcon,
  Trash2Icon,
  PencilIcon,
  CircleCheckIcon,
  CircleXIcon,
  CopyIcon,
  EyeIcon,
  DownloadIcon,
} from "@uiid/icons";
import { Group, Stack, Separator } from "@uiid/layout";
import { Sheet, useToastManager } from "@uiid/overlays";
import { Text } from "@uiid/typography";

import { countComponents } from "@uiid/registry";

import { slugify } from "@/lib/block-file";
import type { BlockFile } from "@/lib/block-file";
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
  const { latestBlocks, versionCounts, remove, rename, load } =
    useSavedBlocks();
  const toastManager = useToastManager();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [open, setOpen] = useState(false);

  const handleExport = async (block: (typeof latestBlocks)[number]) => {
    try {
      const tree = JSON.parse(block.tree);
      const body: BlockFile = {
        name: block.name,
        slug: slugify(block.name),
        description: block.description,
        version: 1,
        tags: [],
        tree,
        createdAt: new Date(block.createdAt).toISOString(),
        updatedAt: new Date(block.updatedAt).toISOString(),
      };
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Export failed");
      toastManager.add({ description: `"${block.name}" exported to blocks/` });
    } catch {
      toastManager.add({ description: "Failed to export block" });
    }
  };

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

  const handleChangeEditName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleKeyDownEditName = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirmRename();
    if (e.key === "Escape") handleCancelRename();
  };

  const getVersionCount = (blockId: string) => {
    return versionCounts.get(blockId) ?? 1;
  };

  const getComponentCount = (treeJson: string) => {
    try {
      const tree = JSON.parse(treeJson);
      return countComponents(tree);
    } catch {
      return null;
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
        <Button tooltip="View saved blocks" size="small" ghost square>
          <FolderOpenIcon />
        </Button>
      }
    >
      <Separator mt={4} />
      <Stack gap={12} py={4} ax="stretch" fullwidth>
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
          latestBlocks.map((block) => {
            const isEditing = editingId === block.blockId;
            return (
              <Stack
                key={block.id}
                gap={8}
                ax="stretch"
                className={styles["block-card"]}
              >
                <Group ax="space-between" ay="start" fullwidth gap={8}>
                  <Stack gap={4}>
                    {isEditing ? (
                      <Input
                        value={editName}
                        onChange={handleChangeEditName}
                        onKeyDown={handleKeyDownEditName}
                        ghost
                        size="large"
                        style={{
                          padding: 0,
                          height: "auto",
                          fontWeight: "bold",
                          fontSize: "var(--typography-text-2-size)",
                        }}
                      />
                    ) : (
                      <Text size={2} weight="bold">
                        {block.name}
                      </Text>
                    )}
                    {block.description && (
                      <Text shade="muted">{block.description}</Text>
                    )}
                    <Group gap={2} ay="center">
                      <Text size={-1} weight="bold">
                        Last saved {formatDate(block.updatedAt)}
                      </Text>
                      &middot;
                      <Text size={-1} weight="bold">
                        {getVersionCount(block.blockId)}{" "}
                        {getVersionCount(block.blockId) === 1
                          ? "version"
                          : "versions"}
                      </Text>
                      {(() => {
                        const cc = getComponentCount(block.tree);
                        if (!cc) return null;
                        return (
                          <>
                            &middot;
                            <Text size={-1} weight="bold">
                              {cc.total}{" "}
                              {cc.total === 1 ? "component" : "components"}
                            </Text>
                          </>
                        );
                      })()}
                    </Group>
                  </Stack>

                  <Group gap={1}>
                    <Button
                      tooltip="View"
                      onClick={() => handleLoad(block)}
                      size="xsmall"
                      ghost
                      square
                      disabled={isEditing}
                    >
                      <EyeIcon />
                    </Button>
                    <Button
                      tooltip="Copy link"
                      onClick={() => handleCopyLink(block)}
                      size="xsmall"
                      ghost
                      square
                      disabled={isEditing}
                    >
                      <CopyIcon />
                    </Button>
                    {isEditing ? (
                      <>
                        <Button
                          tooltip="Confirm"
                          tone="positive"
                          onClick={handleConfirmRename}
                          size="xsmall"
                          ghost
                          square
                        >
                          <CircleCheckIcon />
                        </Button>
                        <Button
                          tooltip="Cancel"
                          tone="critical"
                          onClick={handleCancelRename}
                          size="xsmall"
                          ghost
                          square
                        >
                          <CircleXIcon />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          tooltip="Export to file"
                          onClick={() => handleExport(block)}
                          size="xsmall"
                          ghost
                          square
                        >
                          <DownloadIcon />
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
                      </>
                    )}
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
SavedBlocksPanel.displayName = "SavedBlocksPanel";
