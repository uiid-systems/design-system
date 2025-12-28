import type { ActionKey } from "../image.types";
import {
  MoveDiagonal2Icon,
  DownloadIcon,
  ClipboardIcon,
  Link2Icon,
} from "@uiid/icons";

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
