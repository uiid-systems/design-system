"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@uiid/buttons";
import { SquarePenIcon } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Modal } from "@uiid/overlays";

import { useComponentLoader } from "@/lib/use-component-loader";
import { useChatStore } from "@/lib/store";

export const NewBlockButton = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
    router.push("/registry");
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
          tooltip="New block"
          disabled={messages.length === 0 && !tree && !component}
          size="small"
          variant="ghost"
          shape="square"
        >
          <SquarePenIcon />
        </Button>
      }
      footer={
        <Group ax="end" fullwidth gap={4} mt={2}>
          <Button size="small" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="small" onClick={handleClear}>
            Start over
          </Button>
        </Group>
      }
    />
  );
};
NewBlockButton.displayName = "NewBlockButton";
