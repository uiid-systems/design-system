"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import { SaveIcon } from "@uiid/icons";
import { CheckboxGroup, Input, Switch } from "@uiid/forms";
import { Group, Stack } from "@uiid/layout";
import { Modal } from "@uiid/overlays";

export const SaveButton = () => {
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log("save");
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Ready to save your block?"
      description="Give your UIID block a name. You can come back and work on it later, and save different versions over time."
      size="small"
      icon={SaveIcon}
      trigger={
        <Button size="small">
          <SaveIcon />
          Save block
        </Button>
      }
      footer={
        <Stack ax="stretch" fullwidth gap={2}>
          <Button onClick={handleSave}>Save</Button>
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
        />
      </Stack>
    </Modal>
  );
};
SaveButton.displayName = "SaveButton";
