"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import { SaveIcon } from "@uiid/icons";
import { Input } from "@uiid/forms";
import { Stack } from "@uiid/layout";
import { Modal } from "@uiid/overlays";

import { useSavedBlocks } from "@/lib/use-saved-blocks";
import { useChatStore } from "@/lib/store";

export const SaveButton = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const tree = useChatStore((s) => s.tree);
  const { save } = useSavedBlocks();

  const handleCancel = () => {
    setOpen(false);
    setName("");
  };

  const handleSave = async () => {
    if (!name.trim() || !tree) return;
    await save(name.trim(), tree);
    setOpen(false);
    setName("");
  };

  return (
    <Modal
      data-slot="save-button"
      open={open}
      onOpenChange={setOpen}
      title="Ready to save your block?"
      description="Give your UIID block a name. You can come back and work on it later, and save different versions over time."
      size="small"
      icon={SaveIcon}
      trigger={
        <Button size="small" disabled={!tree}>
          <SaveIcon />
          Save block
        </Button>
      }
      footer={
        <Stack ax="stretch" fullwidth gap={2}>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
          <Button ghost onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      }
    >
      <Stack gap={6} py={6} ax="stretch" fullwidth>
        <Input
          required
          label="Block name"
          placeholder="Give your UIID block a name..."
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleSave();
          }}
        />
      </Stack>
    </Modal>
  );
};
SaveButton.displayName = "SaveButton";
