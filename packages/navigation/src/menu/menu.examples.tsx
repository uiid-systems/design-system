"use client";

import { Button } from "@uiid/buttons";
import { ArchiveIcon } from "@uiid/icons/archive";
import { ChevronDownIcon } from "@uiid/icons/chevron-down";
import { ChevronUpIcon } from "@uiid/icons/chevron-up";
import { CopyIcon } from "@uiid/icons/copy";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { FolderInputIcon } from "@uiid/icons/folder-input";
import { InboxIcon } from "@uiid/icons/inbox";
import { LifeBuoyIcon } from "@uiid/icons/life-buoy";
import { PencilIcon } from "@uiid/icons/pencil";
import { SettingsIcon } from "@uiid/icons/settings";
import { Share2Icon } from "@uiid/icons/share-2";
import { Trash2Icon } from "@uiid/icons/trash-2";
import { UserIcon } from "@uiid/icons/user";
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
      <Text size={-1} emphasis="muted" role="status">
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
 * its own focusable trigger, so don't return a `Button` from one. Keep the
 * label stable: the trigger already announces its state through
 * `aria-expanded`, so only the decorative chevron changes.
 */
export const FunctionTrigger = () => (
  <Menu
    trigger={({ open }) => (
      <Group gap={1} ay="center">
        <Text>Actions</Text>
        {open ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
      </Group>
    )}
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
          <MenuItem label="Edit" icon={PencilIcon} />
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
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  </MenuRoot>
);

/* A composed row takes a `description`, stacked under its label. */
export const Descriptions = () => (
  <MenuRoot>
    <MenuTrigger>
      <Button>Share</Button>
    </MenuTrigger>
    <MenuPortal>
      <MenuBackdrop />
      <MenuPositioner>
        <MenuPopup>
          <MenuItem
            label="Copy link"
            description="Anyone with the link can view"
            icon={CopyIcon}
          />
          <MenuItem
            label="Invite people"
            description="Send an email invitation"
            icon={Share2Icon}
          />
          <MenuItem
            label="Archive"
            description="Hide it from everyone but you"
            icon={ArchiveIcon}
            disabled
          />
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  </MenuRoot>
);

/* An entry's `description` is stacked under its label, submenu triggers too. */
export const ItemDescriptions = () => (
  <Menu
    trigger={<Button>Share</Button>}
    items={[
      {
        label: "Copy link",
        value: "copy",
        description: "Anyone with the link can view",
        icon: CopyIcon,
      },
      {
        label: "Invite people",
        value: "invite",
        description: "Send an email invitation",
        icon: Share2Icon,
        items: [
          { label: "Can view", value: "view" },
          { label: "Can edit", value: "edit" },
        ],
      },
      {
        label: "Archive",
        value: "archive",
        description: "Hide it from everyone but you",
        icon: ArchiveIcon,
        disabled: true,
      },
    ]}
  />
);

/*
 * An entry with an `href` is a real link, so middle-click and open in a new
 * tab work, at any depth. It looks and highlights like any other row.
 */
export const Links = () => (
  <Menu
    trigger={<Button>Account</Button>}
    items={[
      { label: "Profile", value: "profile", href: "#profile", icon: UserIcon },
      {
        label: "Settings",
        value: "settings",
        href: "#settings",
        description: "Notifications, privacy and billing",
        icon: SettingsIcon,
      },
      {
        label: "Help",
        value: "help",
        icon: LifeBuoyIcon,
        items: [
          { label: "Documentation", value: "docs", href: "#docs" },
          { label: "Contact support", value: "support", href: "#support" },
        ],
      },
      { label: "Sign out", value: "sign-out" },
    ]}
  />
);

/*
 * A `{ type: "separator" }` entry draws a line between sets of entries, in a
 * submenu too. The arrow keys skip it.
 */
export const Separators = () => (
  <Menu
    trigger={<Button>Actions</Button>}
    items={[
      { label: "Edit", value: "edit", icon: PencilIcon },
      { label: "Duplicate", value: "duplicate", icon: CopyIcon },
      {
        label: "Move to",
        value: "move",
        icon: FolderInputIcon,
        items: [
          { label: "Inbox", value: "inbox", icon: InboxIcon },
          { type: "separator" },
          { label: "Archive", value: "archive", icon: ArchiveIcon },
        ],
      },
      { type: "separator" },
      { label: "Delete", value: "delete", icon: Trash2Icon },
    ]}
  />
);

/*
 * A disabled row is dimmed and takes no pointer. The keyboard still lands on
 * it, so focus never disappears, but choosing it does nothing.
 */
export const Disabled = () => (
  <Menu
    trigger={<Button>Actions</Button>}
    items={[
      { label: "Edit", value: "edit", icon: PencilIcon },
      {
        label: "Duplicate",
        value: "duplicate",
        icon: CopyIcon,
        disabled: true,
      },
      {
        label: "Move to",
        value: "move",
        icon: FolderInputIcon,
        disabled: true,
        items: [{ label: "Inbox", value: "inbox", icon: InboxIcon }],
      },
      { label: "Delete", value: "delete", icon: Trash2Icon },
    ]}
  />
);

/* A long label widens the popup, and the submenu chevron keeps the far edge. */
export const LongLabels = () => (
  <Menu
    trigger={<Button>Actions</Button>}
    items={[
      { label: "Edit", value: "edit", icon: PencilIcon },
      {
        label: "Duplicate this document with all of its comments",
        value: "duplicate",
        icon: CopyIcon,
      },
      {
        label: "Move this document to another folder",
        value: "move",
        icon: FolderInputIcon,
        items: [
          { label: "Inbox", value: "inbox", icon: InboxIcon },
          { label: "Archive", value: "archive", icon: ArchiveIcon },
        ],
      },
    ]}
  />
);

/* A submenu entry with its own `items` opens a further submenu, at any depth. */
export const NestedSubmenus = () => (
  <Menu
    trigger={<Button>Actions</Button>}
    items={[
      { label: "Edit", value: "edit", icon: PencilIcon },
      {
        label: "Move to",
        value: "move",
        icon: FolderInputIcon,
        items: [
          { label: "Inbox", value: "inbox", icon: InboxIcon },
          {
            label: "Projects",
            value: "projects",
            icon: FolderInputIcon,
            items: [
              { label: "Design", value: "design" },
              { label: "Engineering", value: "engineering" },
              { label: "Marketing", value: "marketing" },
            ],
          },
          { label: "Archive", value: "archive", icon: ArchiveIcon },
        ],
      },
      { label: "Delete", value: "delete", icon: Trash2Icon },
    ]}
  />
);
