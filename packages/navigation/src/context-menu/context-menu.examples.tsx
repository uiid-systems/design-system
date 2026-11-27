"use client";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { ArchiveIcon } from "@uiid/icons/archive";
import { CopyIcon } from "@uiid/icons/copy";
import { DownloadIcon } from "@uiid/icons/download";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { EyeIcon } from "@uiid/icons/eye";
import { FolderInputIcon } from "@uiid/icons/folder-input";
import { PencilIcon } from "@uiid/icons/pencil";
import { Share2Icon } from "@uiid/icons/share-2";
import { Trash2Icon } from "@uiid/icons/trash-2";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Menu } from "../menu/menu";
import type { MenuItemType } from "../menu/menu.types";
import {
  MenuBackdrop,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuSeparator,
  SubmenuRoot,
  SubmenuTrigger,
} from "../menu/subcomponents";
import { ContextMenu } from "./context-menu";
import {
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
} from "./subcomponents";

/* The same actions as the context menu, behind a visible button, so they are
   not reachable only by right-click. */
const REPORT_ACTIONS: MenuItemType[] = [
  { label: "Rename", value: "rename", icon: PencilIcon },
  { label: "Duplicate", value: "duplicate", icon: CopyIcon },
  {
    label: "Move to",
    value: "move",
    items: [
      { label: "Inbox", value: "inbox" },
      { label: "Archive", value: "archive" },
    ],
  },
  { type: "separator" },
  { label: "Delete", value: "delete", icon: Trash2Icon },
];

/* The simple component: the same `items` array Menu takes, and the area that
   opens it as children. The card takes `tabIndex={0}` so a keyboard can focus
   it, and the popup is named through `PopupProps`, since a context menu has
   no trigger button to name it. The same `items` sit behind a Menu button
   beside the card, outside the ContextMenu, so the actions are not reachable
   only by right-click. */
export const OverCard = () => (
  <Group gap={2} ay="start">
    <ContextMenu
      items={REPORT_ACTIONS}
      PopupProps={{ "aria-label": "Report actions" }}
    >
      <Card
        tabIndex={0}
        title="Quarterly report"
        description="Right-click, or use the actions button."
      />
    </ContextMenu>
    <Menu
      align="end"
      trigger={
        <Button variant="ghost" shape="square" tooltip="Report actions">
          <EllipsisVerticalIcon />
        </Button>
      }
      items={REPORT_ACTIONS}
    />
  </Group>
);

/* Submenus nest to any depth, and descriptions, links and separators render
   exactly as they do in Menu, because the rows come from the same function. */
const FILE_ACTIONS: MenuItemType[] = [
  {
    label: "Download",
    value: "download",
    icon: DownloadIcon,
    description: "As a PDF",
  },
  {
    label: "Share",
    value: "share",
    icon: Share2Icon,
    items: [
      { label: "Copy link", value: "copy-link", icon: CopyIcon },
      {
        label: "Invite",
        value: "invite",
        items: [
          { label: "Design team", value: "design" },
          { label: "Engineering", value: "engineering" },
        ],
      },
    ],
  },
  {
    label: "Move to",
    value: "move",
    icon: FolderInputIcon,
    items: [
      { label: "Inbox", value: "inbox" },
      { type: "separator" },
      { label: "Archive", value: "archive", icon: ArchiveIcon },
    ],
  },
  { type: "separator" },
  {
    label: "Open in the viewer",
    value: "viewer",
    icon: EyeIcon,
    href: "#viewer",
  },
];

export const WithSubmenus = () => (
  <Group gap={2} ay="start">
    <ContextMenu
      items={FILE_ACTIONS}
      PopupProps={{ "aria-label": "File actions" }}
    >
      <Card
        tabIndex={0}
        title="brand-guidelines.pdf"
        description="Right-click, or use the actions button."
      />
    </ContextMenu>
    <Menu
      align="end"
      trigger={
        <Button variant="ghost" shape="square" tooltip="File actions">
          <EllipsisVerticalIcon />
        </Button>
      }
      items={FILE_ACTIONS}
    />
  </Group>
);

/* `backdrop={false}` leaves the page undimmed. The menu is still modal: a
   context menu always is, so outside pointers stay blocked while it is
   open. */
export const WithoutBackdrop = () => (
  <Group gap={2} ay="start">
    <ContextMenu
      items={REPORT_ACTIONS}
      backdrop={false}
      PopupProps={{ "aria-label": "Report actions" }}
    >
      <Card
        tabIndex={0}
        title="Quarterly report"
        description="Right-click: the page stays undimmed."
      />
    </ContextMenu>
    <Menu
      align="end"
      backdrop={false}
      trigger={
        <Button variant="ghost" shape="square" tooltip="Report actions">
          <EllipsisVerticalIcon />
        </Button>
      }
      items={REPORT_ACTIONS}
    />
  </Group>
);

/* Right-click, or long-press on touch, anywhere on the card. The popup opens
   at the pointer. Only the root, trigger and positioner are ContextMenu's own;
   the portal, popup, items and submenu are Menu's parts.

   The card takes `tabIndex={0}`, so a keyboard user can focus it and open the
   menu from the keyboard where the platform has a key for it. The popup is
   named by `aria-label`, since a context menu has no trigger button to name
   it. The same actions sit behind a Menu button beside the card, outside the
   trigger and the root, so a right-click in that dropdown stays its own. */
export const Composed = () => (
  <Group gap={2} ay="start">
    <ContextMenuRoot>
      <ContextMenuTrigger>
        <Card
          tabIndex={0}
          title="Quarterly report"
          description="Right-click, or use the actions button."
        />
      </ContextMenuTrigger>
      <MenuPortal>
        <MenuBackdrop />
        <ContextMenuPositioner>
          <MenuPopup aria-label="Report actions">
            <MenuItem label="Rename" icon={PencilIcon} />
            <MenuItem label="Duplicate" icon={CopyIcon} />
            <SubmenuRoot>
              <SubmenuTrigger label="Move to" />
              <MenuPortal>
                <MenuPositioner>
                  <MenuPopup>
                    <MenuItem label="Inbox" />
                    <MenuItem label="Archive" />
                  </MenuPopup>
                </MenuPositioner>
              </MenuPortal>
            </SubmenuRoot>
            <MenuSeparator />
            <MenuItem label="Delete" icon={Trash2Icon} />
          </MenuPopup>
        </ContextMenuPositioner>
      </MenuPortal>
    </ContextMenuRoot>
    <Menu
      align="end"
      trigger={
        <Button variant="ghost" shape="square" tooltip="Report actions">
          <EllipsisVerticalIcon />
        </Button>
      }
      items={REPORT_ACTIONS}
    />
  </Group>
);

/* With `render`, the card is the trigger element itself rather than a child
   of Base UI's `<div>`, so `tabIndex` goes on the rendered card. This example
   shows only `render`: in real use, pair the area with a visible control for
   the same actions, as `Composed` does. */
export const RenderedTrigger = () => (
  <ContextMenuRoot>
    <ContextMenuTrigger
      render={
        <Card
          tabIndex={0}
          title="Shared folder"
          description="Right-click me."
        />
      }
    />
    <MenuPortal>
      <MenuBackdrop />
      <ContextMenuPositioner>
        <MenuPopup aria-label="Folder actions">
          <MenuItem label="Open" />
          <MenuItem label="Share" />
        </MenuPopup>
      </ContextMenuPositioner>
    </MenuPortal>
  </ContextMenuRoot>
);

/* `disabled` on the root leaves the browser's own context menu in place. */
export const Disabled = () => (
  <ContextMenuRoot disabled>
    <ContextMenuTrigger>
      <Card title="Locked">
        <Text>Right-click shows the browser's menu.</Text>
      </Card>
    </ContextMenuTrigger>
    <MenuPortal>
      <ContextMenuPositioner>
        <MenuPopup aria-label="Locked actions">
          <MenuItem label="Edit" />
        </MenuPopup>
      </ContextMenuPositioner>
    </MenuPortal>
  </ContextMenuRoot>
);
