"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import { SaveIcon } from "@uiid/icons";
import { Input, Textarea } from "@uiid/forms";
import { Stack } from "@uiid/layout";
import { Modal, useToastManager } from "@uiid/overlays";

import { useSavedBlocks } from "@/lib/use-saved-blocks";
import { useChatStore } from "@/lib/store";

export const SaveButton = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const tree = useChatStore((s) => s.tree);
  const activeBlockId = useChatStore((s) => s.activeBlockId);
  const activeVersionId = useChatStore((s) => s.activeVersionId);
  const { save, saveAsNew, blocks } = useSavedBlocks();
  const toastManager = useToastManager();

  const isExistingBlock = Boolean(activeBlockId);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && activeBlockId) {
      const activeBlock = blocks.find((b) => b.id === activeVersionId);
      if (activeBlock) {
        setName(activeBlock.name);
        setDescription(activeBlock.description);
        return;
      }
    }
    if (!nextOpen) {
      setName("");
      setDescription("");
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    setName("");
    setDescription("");
  };

  const handleSave = async () => {
    if (!name.trim() || !tree) return;
    await save(name.trim(), description, tree);
    resetAndClose();
    toastManager.add({
      description: isExistingBlock
        ? `New version of "${name.trim()}" saved`
        : `"${name.trim()}" saved`,
    });
  };

  const handleSaveAsNew = async () => {
    if (!name.trim() || !tree) return;
    await saveAsNew(name.trim(), description, tree);
    resetAndClose();
    toastManager.add({ description: `"${name.trim()}" saved as new block` });
  };

  return (
    <Modal
      data-slot="save-button"
      open={open}
      onOpenChange={handleOpenChange}
      title={
        isExistingBlock ? "Save a new version?" : "Ready to save your block?"
      }
      description={
        isExistingBlock
          ? "This will save a new version of the current block. You can also save it as a brand new block."
          : "Give your block a name. You can come back and work on it later, and save different versions over time."
      }
      size="small"
      icon={SaveIcon}
      trigger={
        <Button
          data-slot="save-button"
          tooltip="Save block to browser storage"
          size="small"
          disabled={!tree}
          ghost
        >
          <SaveIcon />
          Save
        </Button>
      }
      footer={
        <Stack ax="stretch" fullwidth gap={2}>
          {isExistingBlock ? (
            <>
              <Button onClick={handleSave} disabled={!name.trim()}>
                Save version
              </Button>
              <Button ghost onClick={handleSaveAsNew} disabled={!name.trim()}>
                Save as new block
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={!name.trim()}>
                Save
              </Button>
              <Button ghost onClick={resetAndClose}>
                Cancel
              </Button>
            </>
          )}
        </Stack>
      }
    >
      <Stack gap={6} py={6} ax="stretch" fullwidth>
        <Input
          required
          label="Block name"
          placeholder="Give your block a name..."
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleSave();
          }}
        />
        <Textarea
          label="Description"
          placeholder="What does this block do?"
          value={description}
          rows={3}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
        />
      </Stack>
    </Modal>
  );
};
SaveButton.displayName = "SaveButton";
