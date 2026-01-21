"use client";

import { useState } from "react";
import { Modal } from "@uiid/overlays";
import { Button } from "@uiid/buttons";
import { Text } from "@uiid/typography";
import { Group } from "@uiid/layout";

export const ModalPreview = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Open Modal</Button>}
      title="Modal Title"
      footer={
        <Group gap={2} ax="end">
          <Button variant="subtle" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </Group>
      }
    >
      <Text shade="muted">This is modal content. You can place any content here.</Text>
    </Modal>
  );
};
ModalPreview.displayName = "ModalPreview";
