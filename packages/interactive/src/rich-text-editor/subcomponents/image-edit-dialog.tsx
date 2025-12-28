import type { Editor } from "@tiptap/react";
import { useState } from "react";

import { ImageIcon } from "@uiid/icons";
import { Modal } from "@uiid/overlays";

import { ToolbarButton } from "./toolbar-button";

import { ImageEditBlock } from "./image-edit-block";

interface ImageEditDialogProps {
  editor: Editor;
}

const ImageEditDialog = ({ editor }: ImageEditDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Select image"
      trigger={
        <ToolbarButton
          isActive={editor.isActive("image")}
          tooltip="Image"
          aria-label="Image"
        >
          <ImageIcon className="size-5" />
        </ToolbarButton>
      }
    >
      <ImageEditBlock editor={editor} close={() => setOpen(false)} />
    </Modal>
  );
};

export { ImageEditDialog };
