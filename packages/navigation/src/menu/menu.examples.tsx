"use client";

import { Button } from "@uiid/buttons";
import { ArchiveIcon } from "@uiid/icons/archive";
import { ChevronDownIcon } from "@uiid/icons/chevron-down";
import { ChevronUpIcon } from "@uiid/icons/chevron-up";
import { CopyIcon } from "@uiid/icons/copy";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { FolderInputIcon } from "@uiid/icons/folder-input";
import { InboxIcon } from "@uiid/icons/inbox";
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
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRadioGroup,
  MenuRadioItem,
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

/*
 * `MenuGroup` sets rows apart under a `MenuGroupLabel`, which names the group
 * for assistive tech. Groups are composed only: in `items`, an entry with its
 * own `items` is a submenu, not a group.
 */
export const Groups = () => (
  <MenuRoot>
    <MenuTrigger>
      <Button>Document</Button>
    </MenuTrigger>
    <MenuPortal>
      <MenuBackdrop />
      <MenuPositioner>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Edit</MenuGroupLabel>
            <MenuItem label="Rename" icon={PencilIcon} />
            <MenuItem label="Duplicate" icon={CopyIcon} />
          </MenuGroup>
          <MenuGroup>
            <MenuGroupLabel>Organize</MenuGroupLabel>
            <MenuItem label="Move to inbox" icon={InboxIcon} />
            <MenuItem label="Archive" icon={ArchiveIcon} />
            <MenuItem label="Delete" icon={Trash2Icon} />
          </MenuGroup>
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  </MenuRoot>
);

const COLUMNS = ["Status", "Owner", "Updated"] as const;

/*
 * `MenuCheckboxItem` toggles a setting, here which table columns show. The
 * menu stays open after each toggle, so several can be set at once. Name is
 * always shown, so its row is checked and disabled.
 */
export const ViewToggles = () => {
  const [shown, setShown] = useState<string[]>(["Status", "Owner"]);

  return (
    <Stack gap={3} ax="start">
      <MenuRoot>
        <MenuTrigger>
          <Button variant="subtle">Columns</Button>
        </MenuTrigger>
        <MenuPortal>
          <MenuBackdrop />
          <MenuPositioner>
            <MenuPopup>
              <MenuGroup>
                <MenuGroupLabel>Show columns</MenuGroupLabel>
                <MenuCheckboxItem label="Name" checked disabled />
                {COLUMNS.map((column) => (
                  <MenuCheckboxItem
                    key={column}
                    label={column}
                    checked={shown.includes(column)}
                    onCheckedChange={(checked) =>
                      setShown((current) =>
                        checked
                          ? [...current, column]
                          : current.filter((entry) => entry !== column),
                      )
                    }
                  />
                ))}
              </MenuGroup>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
      <Text size={-1} emphasis="muted" role="status">
        Showing Name
        {COLUMNS.filter((column) => shown.includes(column)).map(
          (column) => `, ${column}`,
        )}
      </Text>
    </Stack>
  );
};

const SORT_ORDERS = [
  { value: "name", label: "Name", description: "A to Z" },
  { value: "updated", label: "Last updated", description: "Newest first" },
  { value: "size", label: "Size", description: "Largest first" },
] as const;

type SortOrder = (typeof SORT_ORDERS)[number]["value"];

const sortLabel = (value: SortOrder) =>
  SORT_ORDERS.find((order) => order.value === value)?.label;

/*
 * `MenuRadioGroup` holds a one-of-many choice, here the sort order. Choosing a
 * row checks it and unchecks the rest; the menu stays open, as in Base UI,
 * unless a row sets `closeOnClick`.
 */
export const SortPicker = () => {
  const [sort, setSort] = useState<SortOrder>("updated");

  return (
    <Stack gap={3} ax="start">
      <MenuRoot>
        <MenuTrigger>
          <Button variant="subtle">Sort by</Button>
        </MenuTrigger>
        <MenuPortal>
          <MenuBackdrop />
          <MenuPositioner>
            <MenuPopup>
              <MenuRadioGroup
                value={sort}
                onValueChange={(value: SortOrder) => setSort(value)}
              >
                {SORT_ORDERS.map((order) => (
                  <MenuRadioItem
                    key={order.value}
                    value={order.value}
                    label={order.label}
                    description={order.description}
                  />
                ))}
              </MenuRadioGroup>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
      <Text size={-1} emphasis="muted" role="status">
        Sorted by {sortLabel(sort)}
      </Text>
    </Stack>
  );
};

/*
 * Toggles and a one-of-many choice in one menu, each under its own
 * `MenuGroupLabel`. The checkbox and radio rows share one layout, so their
 * labels and checks line up.
 */
export const ViewOptions = () => {
  const [shown, setShown] = useState<string[]>(["Status"]);
  const [sort, setSort] = useState<SortOrder>("name");

  return (
    <Stack gap={3} ax="start">
      <MenuRoot>
        <MenuTrigger>
          <Button variant="subtle">View</Button>
        </MenuTrigger>
        <MenuPortal>
          <MenuBackdrop />
          <MenuPositioner>
            <MenuPopup>
              <MenuGroup>
                <MenuGroupLabel>Show columns</MenuGroupLabel>
                {COLUMNS.map((column) => (
                  <MenuCheckboxItem
                    key={column}
                    label={column}
                    checked={shown.includes(column)}
                    onCheckedChange={(checked) =>
                      setShown((current) =>
                        checked
                          ? [...current, column]
                          : current.filter((entry) => entry !== column),
                      )
                    }
                  />
                ))}
              </MenuGroup>
              <MenuGroup>
                <MenuGroupLabel>Sort by</MenuGroupLabel>
                <MenuRadioGroup
                  value={sort}
                  onValueChange={(value: SortOrder) => setSort(value)}
                >
                  {SORT_ORDERS.map((order) => (
                    <MenuRadioItem
                      key={order.value}
                      value={order.value}
                      label={order.label}
                    />
                  ))}
                </MenuRadioGroup>
              </MenuGroup>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
      <Text size={-1} emphasis="muted" role="status">
        Sorted by {sortLabel(sort)}
      </Text>
    </Stack>
  );
};
