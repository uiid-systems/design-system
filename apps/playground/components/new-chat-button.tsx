"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import { Input } from "@uiid/forms";
import { SquarePenIcon } from "@uiid/icons";
import { Stack } from "@uiid/layout";
import { Modal } from "@uiid/overlays";

import { useComponentLoader } from "@/lib/use-component-loader";
import { useChatStore } from "@/lib/store";

export const NewChatButton = () => {
  const [open, setOpen] = useState(false);

  const messages = useChatStore((s) => s.messages);
  const tree = useChatStore((s) => s.tree);
  const clearActiveBlock = useChatStore((s) => s.clearActiveBlock);
  const { clearSelection, component } = useComponentLoader();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClear = () => {
    clearSelection();
    clearActiveBlock();
    setOpen(false);
  };

  return (
    <Modal
      data-slot="header-action-clear"
      size="small"
      title="You have unsaved changes"
      description="If you proceed, you will lose your work."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          size="small"
          ghost
          disabled={messages.length === 0 && !tree && !component}
        >
          <SquarePenIcon />
          New
        </Button>
      }
      footer={
        <Stack ax="stretch" fullwidth gap={2}>
          <Button size="small" fullwidth onClick={handleClear}>
            Start over
          </Button>
          <Button size="small" fullwidth ghost onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      }
    >
      <Stack gap={6} py={6} ax="stretch" fullwidth>
        <Input placeholder="Enter a prompt to start building..." />
      </Stack>
    </Modal>
  );
};
NewChatButton.displayName = "NewChatButton";
