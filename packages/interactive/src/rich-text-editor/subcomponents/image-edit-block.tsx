import type { Editor } from "@tiptap/react";
import { useRef, useState, useCallback } from "react";

import { Button } from "@uiid/buttons";
import { Input } from "@uiid/forms";
import { Group, Stack } from "@uiid/layout";

interface ImageEditBlockProps {
  editor: Editor;
  close: () => void;
}

export const ImageEditBlock: React.FC<ImageEditBlockProps> = ({
  editor,
  close,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      const insertImages = async () => {
        const contentBucket = [];
        const filesArray = Array.from(files);

        for (const file of filesArray) {
          contentBucket.push({ src: file });
        }

        editor.commands.setImages(contentBucket);
      };

      await insertImages();
      close();
    },
    [editor, close],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (link) {
        editor.commands.setImages([{ src: link }]);
        close();
      }
    },
    [editor, link, close],
  );

  return (
    <Stack render={<form />} onSubmit={handleSubmit} gap={6}>
      <Group gap={2}>
        <Input
          label="Attach an image link"
          id="image-link"
          type="url"
          required
          placeholder="https://example.com"
          value={link}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLink(e.target.value)
          }
        />
        <Button type="submit">Submit</Button>
      </Group>
      <Button type="button" className="w-full" onClick={handleClick}>
        Upload from your computer
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        multiple
        className="hidden"
        hidden
        onChange={handleFile}
      />
    </Stack>
  );
};

export default ImageEditBlock;
