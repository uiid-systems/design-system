import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Button } from "@uiid/buttons";
import { MenuIcon } from "@uiid/icons";

import { Menu } from "./menu";
import type { MenuProps } from "./menu.types";

const MOCK_ITEMS: MenuProps["items"] = [
  { label: "Lorem", value: "item-1" },
  { label: "Lorem ipsum dolor sit amet", value: "item-2" },
  {
    label: "Lorem ipsum",
    value: "item-3",
    items: [
      { label: "Item 3.1", value: "item-3.1" },
      { label: "Item 3.2", value: "item-3.2" },
      { label: "Item 3.3", value: "item-3.3" },
    ],
  },
];

const meta: Meta<typeof Menu> = {
  title: "Interactive/Menu",
  component: Menu,
  args: {
    trigger: (
      <Button
        size="md"
        icon={<MenuIcon size={14} />}
        iconPosition="before"
        variant="subtle"
        grows={false}
      >
        Menu
      </Button>
    ),
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Menu {...args} items={MOCK_ITEMS} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Menu" };
