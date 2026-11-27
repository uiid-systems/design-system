import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  ContextMenu,
  Menu,
  type MenuItemType,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@uiid/design-system";
import { CopyIcon } from "@uiid/icons/copy";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { PencilIcon } from "@uiid/icons/pencil";
import { Trash2Icon } from "@uiid/icons/trash-2";

import * as Examples from "../../../../packages/navigation/src/context-menu/context-menu.examples";

/* Right-click (or long-press) an area to open its menu at the pointer. */
const meta: Meta<typeof ContextMenu> = {
  title: "Navigation/ContextMenu",
  component: ContextMenu,
  tags: ["beta"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OverCard: Story = {
  name: "Over a card",
  render: () => <Examples.OverCard />,
};

const FILES = [
  { name: "brand-guidelines.pdf", owner: "Design", size: "4.2 MB" },
  { name: "q3-roadmap.key", owner: "Product", size: "18.9 MB" },
  { name: "invoice-0042.pdf", owner: "Finance", size: "120 KB" },
];

const fileActions = (name: string): MenuItemType[] => [
  { label: "Rename", value: `${name}-rename`, icon: PencilIcon },
  { label: "Duplicate", value: `${name}-duplicate`, icon: CopyIcon },
  { type: "separator" },
  { label: "Delete", value: `${name}-delete`, icon: Trash2Icon },
];

/*
 * Each row is the trigger itself, through `TriggerProps.render`: a `<tr>`
 * cannot sit inside the default trigger's `<div>`. The row takes
 * `tabIndex={0}`, so a keyboard can focus it and open its menu where the
 * platform has a key for that.
 *
 * The same actions sit behind a button above the table, one submenu per
 * file, outside every row's ContextMenu, so they are not reachable only by
 * right-click. A button inside the row would receive the row's `contextmenu`
 * events through its own portal.
 *
 * This lives in the story, not the examples file: `@uiid/tables` depends on
 * `@uiid/navigation`, so navigation's examples cannot import it.
 */
export const OverTableRow: Story = {
  name: "Over a table row",
  render: () => (
    <Stack gap={2} ax="end" w="full">
      <Menu
        align="end"
        trigger={
          <Button variant="ghost" shape="square" tooltip="File actions">
            <EllipsisVerticalIcon />
          </Button>
        }
        items={FILES.map((file) => ({
          label: file.name,
          value: file.name,
          items: fileActions(file.name),
        }))}
      />
      <TableContainer>
        <TableRoot highlightOnHover>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FILES.map((file) => (
              <ContextMenu
                key={file.name}
                items={fileActions(file.name)}
                TriggerProps={{ render: <TableRow tabIndex={0} /> }}
                PopupProps={{ "aria-label": `${file.name} actions` }}
              >
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.owner}</TableCell>
                <TableCell>{file.size}</TableCell>
              </ContextMenu>
            ))}
          </TableBody>
        </TableRoot>
      </TableContainer>
    </Stack>
  ),
};

export const WithSubmenus: Story = {
  name: "With submenus",
  render: () => <Examples.WithSubmenus />,
};

export const WithoutBackdrop: Story = {
  render: () => <Examples.WithoutBackdrop />,
};

export const Composed: Story = {
  name: "Composed from parts",
  render: () => <Examples.Composed />,
};

export const RenderedTrigger: Story = {
  render: () => <Examples.RenderedTrigger />,
};

export const Disabled: Story = { render: () => <Examples.Disabled /> };
