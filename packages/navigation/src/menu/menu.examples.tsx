"use client";

import { Button } from "@uiid/buttons";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { CopyIcon } from "@uiid/icons/copy";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { PencilIcon } from "@uiid/icons/pencil";
import { Share2Icon } from "@uiid/icons/share-2";
import { Trash2Icon } from "@uiid/icons/trash-2";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Menu } from "./menu";
import type { MenuItemType } from "./menu.types";
import {
  MenuBackdrop,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  SubmenuRoot,
  SubmenuTrigger,
} from "./subcomponents";

const ITEMS: MenuItemType[] = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Delete", value: "delete" },
];

/* A `Button` trigger keeps its native button semantics. */
export const Default = () => (
  <Menu trigger={<Button>Actions</Button>} items={ITEMS} />
);

/* An entry's `icon` is drawn before its label; `disabled` locks it. */
export const Icons = () => (
  <Menu
    trigger={<Button variant="subtle">Actions</Button>}
    items={[
      { label: "Edit", value: "edit", icon: PencilIcon },
      { label: "Duplicate", value: "duplicate", icon: CopyIcon },
      { label: "Delete", value: "delete", icon: Trash2Icon, disabled: true },
    ]}
  />
);

/* An entry with its own `items` opens a submenu beside it. */
export const Submenu = () => (
  <Menu
    trigger={<Button>File</Button>}
    items={[
      { label: "New file", value: "new" },
      {
        label: "Share",
        value: "share",
        icon: Share2Icon,
        items: [
          { label: "Copy link", value: "link" },
          { label: "Email", value: "email" },
        ],
      },
      { label: "Rename", value: "rename" },
    ]}
  />
);

/* Each entry's `onClick` runs when it is chosen. */
export const Actions = () => {
  const [last, setLast] = useState("Nothing chosen yet");
  const items = ITEMS.map((item) => ({
    ...item,
    onClick: () => setLast(`Chose ${item.label}`),
  }));

  return (
    <Stack gap={3} ax="start">
      <Menu trigger={<Button>Actions</Button>} items={items} />
      <Text size={-1} emphasis="muted">
        {last}
      </Text>
    </Stack>
  );
};

/* `side` and `align` place the popup against its trigger. */
export const Placement = () => (
  <Group gap={3}>
    <Menu trigger={<Button>Bottom start</Button>} items={ITEMS} align="start" />
    <Menu trigger={<Button>Top</Button>} items={ITEMS} side="top" />
    <Menu
      trigger={<Button>Right end</Button>}
      items={ITEMS}
      side="right"
      align="end"
    />
  </Group>
);

/*
 * `backdrop={false}` leaves the page undimmed. The menu is still modal, so
 * page scroll stays locked.
 */
export const WithoutBackdrop = () => (
  <Menu trigger={<Button>Actions</Button>} items={ITEMS} backdrop={false} />
);

/* An icon-only `Button` named by its `tooltip`, as a row's overflow menu. */
export const IconTrigger = () => (
  <Menu
    align="end"
    trigger={
      <Button variant="ghost" shape="square" tooltip="More options">
        <EllipsisVerticalIcon />
      </Button>
    }
    items={ITEMS}
  />
);

/*
 * A function trigger follows the open state. Menu renders its result inside
 * its own focusable trigger, so don't return a `Button` from one.
 */
export const FunctionTrigger = () => (
  <Menu
    trigger={({ open }) => <Text>{open ? "Hide" : "Show"} actions</Text>}
    items={ITEMS}
  />
);

/* Compose the parts for a menu the `items` array can't express. */
export const Composed = () => (
  <MenuRoot>
    <MenuTrigger>
      <Button>Composed</Button>
    </MenuTrigger>
    <MenuPortal>
      <MenuBackdrop />
      <MenuPositioner>
        <MenuPopup>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <SubmenuRoot>
            <SubmenuTrigger>
              Move to
              <ChevronRightIcon size={12} />
            </SubmenuTrigger>
            <MenuPortal>
              <MenuPositioner>
                <MenuPopup>
                  <MenuItem>Inbox</MenuItem>
                  <MenuItem>Archive</MenuItem>
                </MenuPopup>
              </MenuPositioner>
            </MenuPortal>
          </SubmenuRoot>
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  </MenuRoot>
);
