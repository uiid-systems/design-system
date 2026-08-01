import type { Editor } from "@tiptap/react";
import { ImageIcon } from "@uiid/icons";
import { Dialog } from "@uiid/overlays";
import { useState } from "react";

import { ImageEditBlock } from "./image-edit-block";
import { ToolbarButton } from "./toolbar-button";

interface ImageEditDialogProps {
  editor: Editor;
}

const ImageEditDialog = ({ editor }: ImageEditDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
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
      <p>Select image</p>
      <ImageEditBlock editor={editor} close={() => setOpen(false)} />
    </Dialog>
  );
};

export { ImageEditDialog };
