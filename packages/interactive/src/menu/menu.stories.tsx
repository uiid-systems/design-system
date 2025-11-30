import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Button } from "@uiid/buttons";
import { MenuIcon } from "@uiid/icons";

import { Menu } from "./menu";
import { MOCK_ITEMS } from "./menu.mocks";

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
