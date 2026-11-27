"use client";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { CopyIcon } from "@uiid/icons/copy";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { PencilIcon } from "@uiid/icons/pencil";
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
