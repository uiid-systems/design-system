import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState, useCallback } from "react";

import type { ShouldShowProps } from "../rich-text-editor.types";

import { LinkEditBlock } from "./link-edit-block";
import { LinkPopoverBlock } from "./link-popover-block";

interface LinkBubbleMenuProps {
  editor: Editor;
}

interface LinkAttributes {
  href: string;
  target: string;
}

export const LinkBubbleMenu = ({ editor }: LinkBubbleMenuProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [linkAttrs, setLinkAttrs] = useState<LinkAttributes>({
    href: "",
    target: "",
  });
  const [selectedText, setSelectedText] = useState("");

  const updateLinkState = useCallback(() => {
    const { from, to } = editor.state.selection;
    const { href, target } = editor.getAttributes("link");
    const text = editor.state.doc.textBetween(from, to, " ");

    setLinkAttrs({ href, target });
    setSelectedText(text);
  }, [editor]);

  const shouldShow = useCallback(
    ({ editor, from, to }: ShouldShowProps) => {
      if (from === to) {
        return false;
      }
      const { href } = editor.getAttributes("link");

      if (!editor.isActive("link") || !editor.isEditable) {
        return false;
      }

      if (href) {
        updateLinkState();
        return true;
      }
      return false;
    },
    [updateLinkState],
  );

  const handleEdit = useCallback(() => {
    setShowEdit(true);
  }, []);

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
        .setLink({ href: url, target: openInNewTab ? "_blank" : "" })
        .run();
      setShowEdit(false);
      updateLinkState();
    },
    [editor, updateLinkState],
  );

  const onUnsetLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowEdit(false);
    updateLinkState();
  }, [editor, updateLinkState]);

  return (
    <BubbleMenu
      data-slot="link-bubble-menu"
      editor={editor}
      shouldShow={shouldShow}
      options={{
        placement: "bottom-start",
        onHide: () => setShowEdit(false),
      }}
    >
      {showEdit ? (
        <LinkEditBlock
          defaultUrl={linkAttrs.href}
          defaultText={selectedText}
          defaultIsNewTab={linkAttrs.target === "_blank"}
          onSave={onSetLink}
          className="bg-popover text-popover-foreground w-full min-w-80 rounded-md border p-4 shadow-md outline-hidden"
        />
      ) : (
        <LinkPopoverBlock
          onClear={onUnsetLink}
          url={linkAttrs.href}
          onEdit={handleEdit}
        />
      )}
    </BubbleMenu>
  );
};
LinkBubbleMenu.displayName = "LinkBubbleMenu";
