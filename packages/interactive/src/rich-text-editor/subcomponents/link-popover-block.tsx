import { useState, useCallback } from "react";

import { Card } from "@uiid/cards";
import { CopyIcon, ExternalLinkIcon, UnlinkIcon } from "@uiid/icons";
import { Group, Separator } from "@uiid/layout";

import { ToolbarButton } from "./toolbar-button";

interface LinkPopoverBlockProps {
  url: string;
  onClear: () => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({
  url,
  onClear,
  onEdit,
}) => {
  const [copyTitle, setCopyTitle] = useState<string>("Copy");

  const handleCopy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopyTitle("Copied!");
          setTimeout(() => setCopyTitle("Copy"), 1000);
        })
        .catch(console.error);
    },
    [url],
  );

  const handleOpenLink = useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <Card data-slot="link-popover-block" render={<Group ay="center" gap={1} />}>
      <ToolbarButton tooltip="Edit link" onClick={onEdit}>
        Edit link
      </ToolbarButton>

      <Separator orientation="vertical" />

      <ToolbarButton tooltip="Open link in a new tab" onClick={handleOpenLink}>
        <ExternalLinkIcon />
      </ToolbarButton>

      <Separator orientation="vertical" />

      <ToolbarButton tooltip="Clear link" onClick={onClear}>
        <UnlinkIcon />
      </ToolbarButton>

      <Separator orientation="vertical" />

      <ToolbarButton
        tooltip={copyTitle}
        onClick={handleCopy}
        // tooltipOptions={{
        //   onPointerDownOutside: (e) => {
        //     if (e.target === e.currentTarget) e.preventDefault();
        //   },
        // }}
      >
        <CopyIcon />
      </ToolbarButton>
    </Card>
  );
};
