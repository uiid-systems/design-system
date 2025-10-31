import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Dropdown } from "./dropdown";

const meta = {
  title: "Dropdowns/Dropdown",
  component: Dropdown,
  args: {
    placeholder: "Dropdown",
    children: "Dropdown content",
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Dropdown",
  render: (args) => {
    return (
      <Stack gap={4}>
        <Dropdown {...args} />
      </Stack>
    );
  },
};
