import { ClipboardIcon } from "@uiid/icons/clipboard";
import { DownloadIcon } from "@uiid/icons/download";
import { Link2Icon } from "@uiid/icons/link-2";
import { MoveDiagonal2Icon } from "@uiid/icons/move-diagonal-2";

import type { ActionKey } from "../image.types";

export const ActionItems: Array<{
  key: ActionKey;
  icon: React.ReactNode;
  tooltip: string;
  isLink?: boolean;
}> = [
  {
    key: "onView",
    icon: <MoveDiagonal2Icon />,
    tooltip: "View image",
  },
  {
    key: "onDownload",
    icon: <DownloadIcon />,
    tooltip: "Download image",
  },
  {
    key: "onCopy",
    icon: <ClipboardIcon />,
    tooltip: "Copy image to clipboard",
  },
  {
    key: "onCopyLink",
    icon: <Link2Icon />,
    tooltip: "Copy image link",
    isLink: true,
  },
];
