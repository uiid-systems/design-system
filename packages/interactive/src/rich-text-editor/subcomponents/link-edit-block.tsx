import { useRef, useState, useCallback } from "react";

import { Button } from "@uiid/buttons";
import { Switch, Input } from "@uiid/forms";
import { Stack, type StackProps } from "@uiid/layout";

export type LinkEditorProps = StackProps & {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
};

export const LinkEditBlock = ({
  onSave,
  defaultIsNewTab,
  defaultUrl,
  defaultText,
  ...props
}: LinkEditorProps) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState(defaultUrl || "");
  const [text, setText] = useState(defaultText || "");
  const [isNewTab, setIsNewTab] = useState(defaultIsNewTab || false);

  const handleSave = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (formRef.current) {
        const isValid = Array.from(
          formRef.current.querySelectorAll("input"),
        ).every((input) => input.checkValidity());

        if (isValid) {
          onSave(url, text, isNewTab);
        } else {
          formRef.current.querySelectorAll("input").forEach((input) => {
            if (!input.checkValidity()) {
              input.reportValidity();
            }
          });
        }
      }
    },
    [onSave, url, text, isNewTab],
  );

  return (
    <div ref={formRef}>
      <Stack data-slot="link-edit-block" gap={4} {...props}>
        <Input
          label="URL"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="url"
          required
        />

        <Input
          label="Display Text (optional)"
          placeholder="Enter display text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Switch
          label="Open in New Tab"
          checked={isNewTab}
          onCheckedChange={setIsNewTab}
        />

        <Button type="button" onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </div>
  );
};
LinkEditBlock.displayName = "LinkEditBlock";
