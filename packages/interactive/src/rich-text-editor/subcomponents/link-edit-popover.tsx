import { useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";

import { Link2Icon } from "@uiid/icons";
import { Popover } from "@uiid/overlays";

import { ToolbarButton } from "./toolbar-button";
import { LinkEditBlock } from "./link-edit-block";

type LinkEditPopoverProps = {
  editor: Editor;
};

const LinkEditPopover = ({ editor }: LinkEditPopoverProps) => {
  const [open, setOpen] = useState(false);

  const { from, to } = editor.state.selection;
  const text = editor.state.doc.textBetween(from, to, " ");

  const onSetLink = useCallback(
    (url: string, text?: string, openInNewTab?: boolean) => {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .insertContent({
          type: "text",
          text: text || url,
          marks: [
            {
              type: "link",
              attrs: {
                href: url,
                target: openInNewTab ? "_blank" : "",
              },
            },
          ],
        })
        .setLink({ href: url })
        .run();

      editor.commands.enter();
    },
    [editor],
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <ToolbarButton
          isActive={editor.isActive("link")}
          tooltip="Link"
          aria-label="Insert link"
          disabled={editor.isActive("codeBlock")}
        >
          <Link2Icon size={20} />
        </ToolbarButton>
      }
      PositionerProps={{
        align: "end",
        side: "bottom",
      }}
    >
      <LinkEditBlock onSave={onSetLink} defaultText={text} />
    </Popover>
  );
};

export { LinkEditPopover };
