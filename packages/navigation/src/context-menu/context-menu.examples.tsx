"use client";

import { Card } from "@uiid/cards";
import { CopyIcon } from "@uiid/icons/copy";
import { PencilIcon } from "@uiid/icons/pencil";
import { Trash2Icon } from "@uiid/icons/trash-2";
import { Text } from "@uiid/typography";

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

/* Right-click, or long-press on touch, anywhere on the card. The popup opens
   at the pointer. Only the root, trigger and positioner are ContextMenu's own;
   the portal, popup, items and submenu are Menu's parts. */
export const Composed = () => (
  <ContextMenuRoot>
    <ContextMenuTrigger>
      <Card
        title="Quarterly report"
        description="Right-click the card for its actions."
      />
    </ContextMenuTrigger>
    <MenuPortal>
      <MenuBackdrop />
      <ContextMenuPositioner>
        <MenuPopup>
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
);

/* With `render`, the card is the trigger element itself rather than a child
   of Base UI's `<div>`. */
export const RenderedTrigger = () => (
  <ContextMenuRoot>
    <ContextMenuTrigger
      render={<Card title="Shared folder" description="Right-click me." />}
    />
    <MenuPortal>
      <MenuBackdrop />
      <ContextMenuPositioner>
        <MenuPopup>
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
        <MenuPopup>
          <MenuItem label="Edit" />
        </MenuPopup>
      </ContextMenuPositioner>
    </MenuPortal>
  </ContextMenuRoot>
);
